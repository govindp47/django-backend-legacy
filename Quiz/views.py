from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.http import JsonResponse
from django.core import serializers
import json

from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Quiz, Question, Answer
# Create your views here.

def quiz_page(request):
    context = {}
    return render(request,"Quiz/quiz.html",context=context)

@method_decorator(login_required, name='dispatch')
class QuizHistoryAPIView(APIView):
    def get(self, request):
        quiz_ids = [quiz.quizId for quiz in Quiz.objects.all()]
        quizzes = Quiz.objects.filter(user=request.user).order_by('-quizTimeStamp')
        quiz_data = [
            {
                'quizId': quiz.quizId,
                'updated_at': quiz.quizTimeStamp.strftime('%Y-%m-%d %H:%M:%S')
            }
            for quiz in quizzes
        ]
        question_ids = {
            quiz.quizId:[question.questionId for question in Question.objects.filter(quiz__quizId=quiz.quizId)] for quiz in quizzes
        }
        response_data = {
            'quizIds': quiz_ids,
            'questionIds':question_ids,
            'quizzes': quiz_data
        }
        return Response(response_data)


@login_required
def createNewQuiz(request):
    if request.method == 'POST':
        quizId = json.loads(request.body).get('quizId')
        Quiz.objects.create(user=request.user, quizId=quizId)
        return JsonResponse({'message': 'Quiz Created Successfully!'})
    else:
        return JsonResponse({'error': 'Invalid request method'})

@login_required
def deleteQuiz(request):
    if request.method == 'POST':
        quizId = json.loads(request.body).get('quizId')
        Quiz.objects.get(quizId=quizId).delete()
        return JsonResponse({'message': 'Quiz Deleted Successfully!'})
    else:
        return JsonResponse({'error': 'Invalid request method'})

@login_required
def createQuestion(request):
    if request.method == 'POST':
        json_data = json.loads(request.body)
        questionId = json_data.get('oldQuestionId')
        if not questionId:
            questionId = json_data.get('questionId')

        quiz = Quiz.objects.get(quizId=json_data.get('quizId'))
        kwargs = {
            'quiz'     : quiz,
            'questionId' : questionId,
        }

        question, created = Question.objects.get_or_create(**kwargs)
        question.questionId = json_data.get('questionId')
        question.questionMarks = json_data.get('questionMarks')
        question.questionType = json_data.get('questionType')
        question.questionText = json_data.get('questionText')
        question.questionOptions = json_data.get('questionOptions')
        question.save()

        return JsonResponse({'message': 'Question saved successfully'})
    else:
        return JsonResponse({'error': 'Invalid request method'})

@login_required
def previewQuiz(request, quizId):
    context = {
        "quizId":quizId,
        }
    return render(request,"Quiz/preview_quiz.html",context=context)

@login_required
def previewQuizJson(request):
    if request.method == 'POST':
        json_data = json.loads(request.body)
        questions = Question.objects.filter(quiz__quizId=json_data.get('quizId'))
        data = serializers.serialize('json', questions)
        return JsonResponse(data, safe=False)
    else:
        return JsonResponse({'error': 'Invalid request method'})

@login_required
def deleteQuestion(request):
    if request.method == 'POST':
        quizId = json.loads(request.body).get('quizId')
        questionId = json.loads(request.body).get('questionId')
        quiz = Quiz.objects.get(quizId=quizId)
        Question.objects.get(quiz=quiz, questionId=questionId).delete()
        return JsonResponse({'message': 'Question Deleted Successfully!'})
    else:
        return JsonResponse({'error': 'Invalid request method'})

@login_required
def practice_quiz(request):
    context = {}
    return render(request,"Quiz/practice_quiz.html",context=context)

@login_required
def practice_quiz_json(request):
    if request.method == 'POST':
        json_data = json.loads(request.body)
        questions = Question.objects.filter(quiz__quizId=json_data.get('quizId')).order_by('?')#[:10]
        data = serializers.serialize('json', questions)
        return JsonResponse(data, safe=False)
    else:
        return JsonResponse({'error': 'Invalid request method'})


