from django.db import models
from django.utils import timezone
from django.db.models import UniqueConstraint
from django.contrib.auth.models import User

from nirgovind import settings

# Create your models here.

class Quiz(models.Model):
    user               = models.ForeignKey(User, on_delete=models.CASCADE, related_name='quiz')
    quizId             = models.CharField(max_length=7, default='Aa12345', unique=True)
    quizTimeStamp      = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.quizId}({self.user.username})'


class Question(models.Model):
    QUESTION_TYPES = (
        ('MCQ', 'Multiple Choice'),
        ('TF', 'True/False'),
        ('FB', 'Fill-in-the-Blank'),
        ('FMB', 'Fill-in-Multiple-Blanks'),
        ('MA', 'Multiple Answers'),
        ('DD', 'Drop-down'),
        ('MATCH', 'Matching'),
        ('NUM', 'Numerical Answer'),
        ('ESSAY', 'Essay'),
        ('UPLOAD', 'File Upload'),
    )

    quiz               = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='question')
    questionId         = models.CharField(max_length=7, default='Aa12345')
    questionType       = models.CharField(max_length=30, choices=QUESTION_TYPES, default='MCQ')
    questionText       = models.TextField(help_text="Enter Question", default="?")
    questionMarks      = models.DecimalField(max_digits=4, decimal_places=2, default=1.00)
    questionOptions    = models.CharField(max_length=4000, null=True, blank=True)

    class Meta:
        constraints = [
            UniqueConstraint(fields=['quiz','questionId'], name='unique_question')
        ]
    
    def save(self, *args, **kwargs):
        if self.pk:
            try:
                self.answer.delete()
            except Answer.DoesNotExist:
                pass

        super().save(*args, **kwargs)
        self.quiz.quizTimeStamp = timezone.now()
        self.quiz.save()
        Answer.objects.create(question=self)
    
    def delete(self, *args, **kwargs):
        super().delete(*args, **kwargs)
        self.quiz.quizTimeStamp = timezone.now()
        self.quiz.save()

    def __str__(self):
        return f'{self.quiz.quizId}/Question={self.questionId}({self.questionType})'

class Answer(models.Model):
    question           = models.OneToOneField(Question, on_delete=models.CASCADE, related_name='answer')
    correctAnswer      = models.CharField(max_length=4000, null=True, blank=True)
    explaination       = models.TextField(help_text="Enter Explaination", null=True, blank=True)

    def delete(self, *args, **kwargs):
        self.question.delete()
        super().delete(*args, **kwargs)
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.question.quiz.quizTimeStamp = timezone.now()
        self.question.quiz.save()

    def __str__(self):
        return f'Answer:{self.question.quiz.quizId}/Question={self.question.questionId}({self.question.questionType})'
