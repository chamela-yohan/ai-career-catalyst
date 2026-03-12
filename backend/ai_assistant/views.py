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
            model = genai.GenerativeModel('gemini-pro')
            response = model.generate_content(user_prompt)
            
            return Response({
                "status": "success",
                "ai_response": response.text
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)