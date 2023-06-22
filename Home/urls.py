from django.contrib import admin
from django.urls import path
from . import views

app_name = "Home"

urlpatterns = [
    path('',views.index,name='index'),
    path('visual/',views.visual,name='visual'),
    path('visual/like_slide',views.like_slide,name='like_slide'),
    path('visual/refresh_videos',views.refresh_videos,name='refresh_videos'),
    path('quotes/',views.quotes,name='quotes'),
    path('contact/',views.contact,name='contact'),
    path('login_page/',views.login_page,name='login_page'),
]