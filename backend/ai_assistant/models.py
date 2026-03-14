from django.db import models

# Create your models here.
class InterviewSession(models.Model):
    firebase_uid = models.CharField(max_length=255, db_index=True, null=True, blank=True) # User ගේ ID එක
    job_role = models.CharField(max_length=255)
    experience_level = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.job_role} - {self.created_at.strftime('%Y-%m-%d')}"
    
class InterviewQuestion(models.Model):
    
    session = models.ForeignKey(InterviewSession, related_name='questions', on_delete=models.CASCADE)
    question_text = models.TextField()
    topic = models.CharField(max_length=100)
    model_answer = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return self.topic