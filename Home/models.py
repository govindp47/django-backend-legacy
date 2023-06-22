import os
from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.db.models import UniqueConstraint

from nirgovind import settings
# Create your models here.

class Slide(models.Model):

    def slides_upload_path(instance,filename):
        ext = filename.split('.')[-1]
        new_name = f'Shloka={instance.chapter}-{instance.shloka}-{instance.slide_number}.{ext}'
        path = os.path.join(settings.MEDIA_ROOT,'slide',new_name)
        return path
    
    chapter                 = models.PositiveIntegerField(default=0)
    shloka                  = models.PositiveIntegerField(default=0)
    slide_number            = models.PositiveIntegerField(default=0)
    slide_image             = models.ImageField(upload_to=slides_upload_path,null=True,blank=True)

    def __str__(self):
        return f'{self.chapter}.{self.shloka}-{self.slide_number}'
    
    class Meta:
        constraints = [
            UniqueConstraint(fields=['chapter', 'shloka', 'slide_number'], name='unique_slide_number')
        ]

    def clean(self):
        super().clean()
        if Slide.objects.filter(chapter=self.chapter, shloka=self.shloka, slide_number=self.slide_number).exists():
            raise ValidationError('Video number must be unique within each ID.')

class Shloka(models.Model):

    def sanskrit_upload_path(instance,filename):
        ext = filename.split('.')[-1]
        new_name = f'Sanskrit-Shloka={instance.chapter}-{instance.shloka}.{ext}'
        path = os.path.join(settings.MEDIA_ROOT,'slide',new_name)
        return path
    
    def hindi_upload_path(instance,filename):
        ext = filename.split('.')[-1]
        new_name = f'Hindi-Shloka={instance.chapter}-{instance.shloka}.{ext}'
        path = os.path.join(settings.MEDIA_ROOT,'slide',new_name)
        return path
    
    def english_upload_path(instance,filename):
        ext = filename.split('.')[-1]
        new_name = f'English-Shloka={instance.chapter}-{instance.shloka}.{ext}'
        path = os.path.join(settings.MEDIA_ROOT,'slide',new_name)
        return path
    
    def gujarati_upload_path(instance,filename):
        ext = filename.split('.')[-1]
        new_name = f'Gujarati-Shloka={instance.chapter}-{instance.shloka}.{ext}'
        path = os.path.join(settings.MEDIA_ROOT,'slide',new_name)
        return path
    
    def marathi_upload_path(instance,filename):
        ext = filename.split('.')[-1]
        new_name = f'Marathi-Shloka={instance.chapter}-{instance.shloka}.{ext}'
        path = os.path.join(settings.MEDIA_ROOT,'slide',new_name)
        return path
    
    chapter                 = models.PositiveIntegerField(default=0)
    shloka                  = models.PositiveIntegerField(default=0)
    sanskrit                = models.ImageField(upload_to=sanskrit_upload_path,null=True,blank=True)
    hindi                   = models.ImageField(upload_to=hindi_upload_path,null=True,blank=True)
    english                 = models.ImageField(upload_to=english_upload_path,null=True,blank=True)
    gujarati                = models.ImageField(upload_to=gujarati_upload_path,null=True,blank=True)
    marathi                 = models.ImageField(upload_to=marathi_upload_path,null=True,blank=True)

    def __str__(self):
        return f'Shloka={self.chapter}-{self.shloka}'


class UserInteraction(models.Model):
    user                    = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_interaction')
    chapter                 = models.PositiveIntegerField(default=0)
    shloka                  = models.PositiveIntegerField(default=0)
    liked                   = models.BooleanField(default=False)

    def __str__(self):
        return f'Shloka={self.chapter}-{self.shloka}{self.liked}'

class YoutubeVideos(models.Model):
    chapter                 = models.PositiveIntegerField(default=0)
    shloka                  = models.PositiveIntegerField(default=0)
    video_id                = models.CharField(max_length=20)
    video_number            = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f'Shloka={self.chapter}-{self.shloka}{self.video_id}'
    
    class Meta:
        constraints = [
            UniqueConstraint(fields=['chapter', 'shloka', 'video_number'], name='unique_video_number')
        ]

    def clean(self):
        super().clean()
        if YoutubeVideos.objects.filter(chapter=self.chapter, shloka=self.shloka, video_number=self.video_number).exists():
            raise ValidationError('Video number must be unique within each ID.')
