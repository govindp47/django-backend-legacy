import os
from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.core.validators import MinLengthValidator

from nirgovind import settings
# Create your models here.

class UserProfile(models.Model):

    def profile_pic_path(instance,filename):
        ext = filename.split('.')[-1]
        new_name = f'{instance.user.username}.{ext}'
        path = os.path.join(settings.MEDIA_ROOT,'profile_pic',new_name)
        return path

    # custom validator
    def only_int(value: str): 
        if value.isdigit()==False:
            raise ValidationError('Not valid phone number')
    
    # model fields
    user                = models.OneToOneField(User, on_delete=models.CASCADE,related_name='user_profile')
    phone               = models.CharField(max_length=10,validators=[only_int,MinLengthValidator(10)],null=True,blank=True)
    about               = models.TextField(null=True,blank=True)
    profile_pic         = models.ImageField(upload_to=profile_pic_path,null=True,blank=True)
    location            = models.CharField(max_length=100, blank=True)
    website             = models.URLField(blank=True)
    instagram_link      = models.URLField(blank=True)
    facebook_link       = models.URLField(blank=True)
    linkedin_link       = models.URLField(blank=True)
    twitter_link        = models.URLField(blank=True)

    def __str__(self):
        return f'{self.user.username}'
    
    class Meta:
        verbose_name_plural = 'User Profiles'
        ordering = ['user']