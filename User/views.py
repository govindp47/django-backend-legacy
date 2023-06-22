from django.shortcuts import render,get_object_or_404
from django.contrib.auth import logout,login,authenticate
from django.contrib.auth.forms import AuthenticationForm, PasswordResetForm, SetPasswordForm, PasswordChangeForm
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
import random
from django.core.mail import send_mail
from urllib.parse import urlencode

from .models import UserProfile
from .forms import UserUpdateForm,UserProfileUpdateForm,LoginForm,SignupForm
# Create your views here.

def logout_user(request):
    logout(request)
    return HttpResponseRedirect(reverse("Home:index"))


def login_user(request):

    if request.method !="POST":
        #display a blank form
        form = LoginForm(request)
    
    else:
        form = LoginForm(request,data = request.POST)

        if form.is_valid():
            user = form.get_user()
            login(request,user)
            return HttpResponseRedirect(reverse("Home:index"))

    context = {"form":form}

    return render(request,"User/login.html",context=context)

def send_otp(request):

    message = ""
    if request.method != 'POST':
        form = PasswordResetForm()
    else:
        form = PasswordResetForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data['email']
            if User.objects.filter(email=email).exists():
                
                # Generate OTP
                otp = random.randint(100000, 999999)
                
                # Send OTP to user's email
                send_mail(
                    'OTP Verification',
                    f'Your OTP is: {otp}',
                    'noreply@example.com',
                    [email],
                    fail_silently=False,
                )
                
                # Store the OTP in session for verification
                request.session['otp'] = otp
                request.session['email'] = email
                
                return HttpResponseRedirect(reverse("User:verify_otp"))
            else:
                message = "This email is not registered."

    context = {"form":form,
               "message":message,}

    return render(request,"User/send_otp.html",context=context)

def verify_otp(request):
    if request.method != 'POST':
        error_message = ''
    
    else:
        entered_otp = request.POST.get('otp')
        stored_otp = request.session.get('otp')
        email = request.session.get('email')
        
        if entered_otp == str(stored_otp):
            # OTP verification successful
            # Clear the OTP and email from the session
            del request.session['otp']
            del request.session['email']
            
            query_params = urlencode({'email': email})
            redirect_url = reverse('User:reset_password') + '?' + query_params
            # Redirect to the password reset page on successful verification
            return HttpResponseRedirect(redirect_url)
        else:
            # OTP verification failed
            # Handle the error or display an error message
            error_message = 'Invalid OTP. Please try again.'
        
    context = {'error_message': error_message,}
    return render(request, "User/verify_otp.html", context)

def password_reset(request):

    if request.method != 'POST':
        email = request.GET.get('email')
        user = User.objects.get(email=email)
        form = SetPasswordForm(user)

    else:
        email = request.POST.get('email')
        user = User.objects.get(email=email)
        form = SetPasswordForm(user, request.POST)
        if form.is_valid():
            # Save the new password
            form.save()
            return HttpResponseRedirect(reverse("User:login"))

    context = {
        'form': form,
        'email': email,
    }
    return render(request, "User/reset_password.html", context)

def signup_user(request):

    if request.method !="POST":
        #display a blank form
        form = SignupForm()
    
    else:
        form = SignupForm(request.POST, request.FILES)

        if form.is_valid():
            user = form.save()
            profile_pic = form.cleaned_data['profile_pic'] 
            profile = UserProfile(user=user, profile_pic=profile_pic)
            profile.save()
            return HttpResponseRedirect(reverse("User:login"))

    context = {"form":form,}

    return render(request,"User/signup.html",context=context)

def view_profile(request,username):

    user = User.objects.get(username=username)

    context = {"user":user,}
    return render(request,"User/profile.html",context=context)

@login_required
def edit_profile(request):

    if request.method != "POST":
        # display blank form
        form1 = UserUpdateForm(instance=request.user)
        form2 = UserProfileUpdateForm(instance=request.user.user_profile)
    else:
        # process form data
        form1 = UserUpdateForm(request.POST, instance=request.user)
        form2 = UserProfileUpdateForm(request.POST, request.FILES, instance=request.user.user_profile)
        if form1.is_valid() and form2.is_valid():
            form1.save()
            form2.save()

            return HttpResponseRedirect(reverse("User:profile",kwargs={"username": request.user.username}))

    context = {
        "form1":form1,
        "form2":form2,
        "username":request.user.username,
    }
    return render(request,"User/edit_profile.html",context=context)

@login_required
def change_password(request):
    if request.method != "POST":
        # display blank form
        form = PasswordChangeForm(request.user)
    else:
        # process form data
        form = PasswordChangeForm(request.user,request.POST)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect(reverse("User:login"))

    context = {"form":form}
    return render(request,"User/change_password.html",context=context)