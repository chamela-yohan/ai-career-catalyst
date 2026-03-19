from google import genai
import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

import json

from .models import InterviewQuestion, InterviewSession
from .serializers import InterviewQuestionSerializer, InterviewSessionSerializer

import firebase_admin
from firebase_admin import credentials, auth as firebase_auth



if not firebase_admin._apps:
    cred = credentials.Certificate('ai_assistant/app/serviceAccountKey.json')
    firebase_admin.initialize_app(cred)


# Gemini Configure කිරීම
client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

class GeminiTestView(APIView):
    def post(self, request):
        user_prompt = request.data.get('prompt', '')
        
        if not user_prompt:
            return Response({"error": "Prompt is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            #model = genai.GenerativeModel('gemini-2.5-flash')
            response = client.models.generate_content(
                        model='gemini-2.5-flash',
                        contents=user_prompt
                       )
            
            return Response({
                "status": "success",
                "ai_response": response.text
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class InterviewGeneratorView(APIView):
    def post(self, request):
        job_role = request.data.get('job_role', '')
        experience = request.data.get('experience', 'Junior')

        if not job_role:
            return Response({"error": "Job role is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Prompt Engineering
        prompt = f"""
        Act as a professional technical interviewer. 
        Generate 5 interview questions for a {job_role} position at a {experience} level.
        Return the response ONLY as a JSON array of objects with the following keys:
        "id" (int), "question" (string), "topic" (string).
        Do not include any other text or explanation.
        """

        try:
           # model = genai.GenerativeModel('gemini-2.5-flash')
            response = client.models.generate_content(
                        model='gemini-2.5-flash',
                        contents=prompt
                        )
            
            # AI එකෙන් එන JSON string එක clean කරිම
            
            raw_text = response.text.replace('```json', '').replace('```', '').strip()
            
            questions_data = json.loads(raw_text)
            
            auth_header = request.headers.get("Authorization")
            if not auth_header or not auth_header.startswith("Bearer "):
                return Response({"error": "Unauthorized"}, status=401)
            
            token = auth_header.split(" ")[1]
            
            try:
                decoded = firebase_auth.verify_id_token(token)
                uid = decoded['uid']   
            except Exception:
                return Response({"error": "Invalid token"}, status=401)
            
            session = InterviewSession.objects.create(
                job_role=job_role,
                experience_level=experience,
                firebase_uid=uid
            )
            
            for q in questions_data:
                InterviewQuestion.objects.create(
                    session=session,
                    question_text=q['question'],
                    topic=q['topic']
                )
            
            return Response({
                "status": "success",
                "session_id": session.id, # new session id
                "questions": questions_data
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            import traceback
            traceback.print_exc() 
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class InterviewHistoryView(APIView):
    def get(self, request):
        sessions = InterviewSession.objects.all().order_by('-created_at')
        serializer = InterviewSessionSerializer(sessions, many=True)
            
        auth_header = request.headers.get("Authorization")
      
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
            
            try:
                decoded = firebase_auth.verify_id_token(token)
                uid = decoded['uid']   
            except Exception:
                return Response({"error": "Invalid token"}, status=401)
            
        else:
            return Response(
                {"error": "Authorization token missing or invalid"},
                status=401
            )   
        
        sessions = InterviewSession.objects.filter(firebase_uid=uid).order_by('-created_at')
        serializer = InterviewSessionSerializer(sessions, many=True)
        
        return Response(serializer.data)
    
# අපිට ඕනි session එක ගන්න    
class SessionDetailView(APIView):
    def get(self, request, session_id):
        try:
           get_object_or_404(InterviewSession, id=session_id)
           questions = InterviewQuestion.objects.filter(session_id=session_id)
           serializer = InterviewQuestionSerializer(questions, many=True)
           return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        
        
class AnswerEvaluationView(APIView):
    def post(self,request):
        question_text = request.data.get('question', '')
        user_answer = request.data.get('answer', '')
        job_role = request.data.get('job_role', 'Software Engineer')
        
        # AI prompt එක
        prompt = f"""
        You are an expert technical interviewer for the role of {job_role}.
        Evaluate the following user answer for the given question.
        
        Question: {question_text}
        User Answer: {user_answer}
        
        Please provide the response strictly in the following JSON format:
        {{
            "score": "A score out of 10 (e.g., 8/10)",
            "feedback": "A brief paragraph about what was good and what was missing",
            "improvement_tips": ["tip 1", "tip 2", "tip 3"],
            "model_answer_snippet": "A short version of how a perfect answer should look"
        }}
        """
        
        try:
            response = client.models.generate_content(
                        model='gemini-2.5-flash',
                        contents=prompt
                        )
            raw_text = response.text.replace('```json', '').replace('```', '').strip()
            
            evaluation_data = json.loads(raw_text)
            
            return Response(evaluation_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)