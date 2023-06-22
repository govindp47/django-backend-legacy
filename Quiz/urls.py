from django.urls import path

from . import views

app_name = "Quiz"

urlpatterns = [
    path("quiz",views.quiz_page,name='quiz'),
    path("create-new-quiz",views.createNewQuiz,name='create_new_quiz'),
    path("quiz-page-history",views.QuizHistoryAPIView.as_view(),name='quiz_page_history'),
    path("delete-quiz/",views.deleteQuiz,name='delete_quiz'),
    path("save-question",views.createQuestion,name='add_question'),
    path("preview-quiz/<str:quizId>",views.previewQuiz,name='preview_quiz'),
    path("preview-quiz-json",views.previewQuizJson,name='preview_quiz_json'),
    path("delete-question/",views.deleteQuestion,name='delete_question'),
    path("practice_quiz",views.practice_quiz,name='practice_quiz'),
    path("practice_quiz_json",views.practice_quiz_json,name='practice_quiz_json'),
    
]