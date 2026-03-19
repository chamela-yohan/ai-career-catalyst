from django.urls import path
from .views import GeminiTestView,InterviewGeneratorView, InterviewHistoryView, SessionDetailView, AnswerEvaluationView


urlpatterns = [
    path('test-ai/', GeminiTestView.as_view(), name='test_ai'),
    path('generate-questions/', InterviewGeneratorView.as_view(), name='generate_questions'),
    
    path('history/', InterviewHistoryView.as_view(), name='interview_history'),
    path('history/<int:session_id>/', SessionDetailView.as_view(), name='session_detail'),
    path('evaluate-answer/', AnswerEvaluationView.as_view(), name='evaluate_answer')
]