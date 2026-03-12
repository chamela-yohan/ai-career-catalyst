from django.urls import path
from .views import GeminiTestView

urlpatterns = [
    path('test-ai/', GeminiTestView.as_view(), name='test_ai')
]