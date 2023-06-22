from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password

from .models import UserProfile
from .widgets import ImageWidget

class LoginForm(AuthenticationForm):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['username'].label = 'Username/Email'
        for f in self.visible_fields():
            f.field.widget.attrs['class'] = 'input1'
    
    def clean(self):
        username = self.cleaned_data.get('username')
        password = self.cleaned_data.get('password')

        # Check if the username is an email
        try:
            user = User.objects.get(email=username)
        except User.DoesNotExist:
            user = None

        # Authenticate the user using username or email
        self.user_cache = authenticate(self.request, username=username, password=password)
        
        if self.user_cache is None:
            if user is not None:
                self.user_cache = authenticate(self.request, username=user.username, password=password)

        if self.user_cache is None:
            raise self.get_invalid_login_error()
        
        self.confirm_login_allowed(self.user_cache)

        return self.cleaned_data
    

class SignupForm(UserCreationForm):
    
    first_name = forms.CharField(max_length=30, required=True)
    last_name = forms.CharField(max_length=30, required=True)
    email = forms.EmailField(max_length=254, required=True)
    profile_pic = forms.ImageField(required=False)

    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'profile_pic', 'email', 'password1', 'password2')
    
    def save(self, commit=True):
        user = super().save(commit=False)
        user.first_name = self.cleaned_data['first_name']
        user.last_name = self.cleaned_data['last_name']
        user.email = self.cleaned_data['email']
        
        if commit:
            user.save()
        
        return user

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for f in self.visible_fields():
            f.field.widget.attrs['class'] = 'input1'

    def clean(self):
        cleaned_data = super().clean()
        username = cleaned_data.get('username')
        email = cleaned_data.get('email')

        # Check if username is already taken
        if User.objects.filter(username=username).exists():
            self.add_error('username', 'This username is already taken.')

        # Check if email is already registered
        if User.objects.filter(email=email).exists():
            self.add_error('email', 'This email is already registered.')

        return cleaned_data
    

class UserUpdateForm(forms.ModelForm):

    class Meta:
        model = User
        fields = ('username', 'email', 'first_name', 'last_name')
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        for f in self.visible_fields():
            f.field.widget.attrs['class'] = 'input1'
    
    def clean(self):
        cleaned_data = super().clean()
        username = cleaned_data.get('username')
        email = cleaned_data.get('email')

        # Check if username is already taken
        if self.instance.username!=username and User.objects.filter(username=username).exists():
            self.add_error('username', 'This username is already taken.')

        # Check if email is already registered
        if self.instance.email!=email and User.objects.filter(email=email).exists():
            self.add_error('email', 'This email is already registered.')

        return cleaned_data



class UserProfileUpdateForm(forms.ModelForm):

    class Meta:
        model = UserProfile
        fields = ('phone','about','profile_pic','location', 'website', 'instagram_link', 'facebook_link', 'linkedin_link', 'twitter_link')
        #widgets = {
        #    'profile_pic': ImageWidget,
        #}

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        for f in self.visible_fields():
            f.field.widget.attrs['class'] = 'input1'

