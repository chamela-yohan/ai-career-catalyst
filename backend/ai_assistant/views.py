import google.generativeai as genai
import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

# Gemini Configure කිරීම
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

class GeminiTestView(APIView):
    def post(self, request):
        user_prompt = request.data.get('prompt', '')
        
        if not user_prompt:
            return Response({"error": "Prompt is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            model = genai.GenerativeModel('gemini-2.5-flash')
            response = model.generate_content(user_prompt)
            
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
            model = genai.GenerativeModel('gemini-2.5-flash')
            response = model.generate_content(prompt)
            
            # AI එකෙන් එන JSON string එක clean කරිම
            
            raw_text = response.text.replace('```json', '').replace('```', '').strip()
            
            return Response({
                "status": "success",
                "questions": eval(raw_text) # සරලව string එක list එකක් බවට පත් කිරීම
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)