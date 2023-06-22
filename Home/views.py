from django.shortcuts import render, get_object_or_404
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.core import serializers
import json

from .models import Slide, Shloka, UserInteraction, YoutubeVideos
# Create your views here.
def index(request):
    context = {}
    return render(request,"Home/index.html",context=context)

def visual(request):
    current_ch = 1
    current_sk = 1
    ch_sk = [0,47,72,43,42,29,47,30,28,34,42,55,20,34,27,20,24,28,78]
    if request.method=="POST":
        if request.POST.get('chapter-value'):
            current_ch = int(request.POST.get('chapter-value'))
        if request.POST.get('shloka-value'):
            current_sk = int(request.POST.get('shloka-value'))
    if current_sk>ch_sk[current_ch]:
        current_sk = 1
    slides = Slide.objects.filter(chapter=current_ch,shloka=current_sk).order_by('slide_number')
    current_shloka = Shloka.objects.get(chapter=current_ch,shloka=current_sk)
    likes = UserInteraction.objects.filter(chapter=current_ch,shloka=current_sk,liked=True).count()
    videos = YoutubeVideos.objects.filter(chapter=current_ch,shloka=current_sk).order_by('?')[:4]
    context = {"slides":slides,
               "current_shloka":current_shloka,
               "ch_values":[i+1 for i in range(18)],
               "sk_values":[i+1 for i in range(ch_sk[current_ch])],
               "current_ch":current_ch,
               "current_sk":current_sk,
               "likes":likes,
               "videos":videos,
            }
    return render(request,"Home/visual.html",context=context)


@login_required
def like_slide(request):
    if request.method == 'POST':
        json_data = json.loads(request.body)
        kwargs = {
            'user'    : request.user,
            'chapter' : json_data.get('current_ch'),
            'shloka'  : json_data.get('current_sk'),
        }
        user_interaction, created = UserInteraction.objects.get_or_create(**kwargs)
        user_interaction.liked = json_data.get('liked')
        user_interaction.save()
        return JsonResponse({'message': 'Slide liked successfully'})
    else:
        return JsonResponse({'error': 'Invalid request method'})

def refresh_videos(request):
    if request.method == 'POST':
        json_data = json.loads(request.body)
        current_ch = json_data.get('current_ch')
        current_sk = json_data.get('current_sk')
        videos = YoutubeVideos.objects.filter(chapter=current_ch,shloka=current_sk).order_by('?')[:3]
        data = serializers.serialize('json', videos)
        return JsonResponse(data, safe=False)
    else:
        return JsonResponse({'error': 'Invalid request method'})

def quotes(request):
    context = {}
    return render(request,"Home/quotes.html",context=context)

def contact(request):
    context = {}
    return render(request,"Home/contact.html",context=context)

def login_page(request):
    context = {}
    return render(request,"Home/login_page.html",context=context)

