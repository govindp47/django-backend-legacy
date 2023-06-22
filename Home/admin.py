from django.contrib import admin

from .models import Slide, Shloka, UserInteraction, YoutubeVideos
# Register your models here.

admin.site.register(Slide)
admin.site.register(Shloka)
admin.site.register(UserInteraction)
admin.site.register(YoutubeVideos)