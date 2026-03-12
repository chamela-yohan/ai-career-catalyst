from django.urls import path
from .views import GeminiTestView,InterviewGeneratorView


urlpatterns = [
    path('test-ai/', GeminiTestView.as_view(), name='test_ai'),
    path('generate-questions/', InterviewGeneratorView.as_view(), name='generate_questions'),
]