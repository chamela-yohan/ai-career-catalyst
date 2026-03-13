from rest_framework import serializers
from .models import InterviewQuestion, InterviewSession

class InterviewQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = InterviewQuestion
        fields = '__all__'
        
class IinterviewSessionSerializer(serializers.ModelSerializer):
    question_count = serializers.IntegerField(source='questions.count', read_only=True) # session එකට අදාල ප්‍රශ්න ගාන
    
    class Meta:
        model = InterviewSession
        fields = ['id', 'job_role', 'experience_level', 'created_at', 'question_count']