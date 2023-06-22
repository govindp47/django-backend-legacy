from django.urls import path

from . import views

app_name = "User"

urlpatterns = [
    path("logout",views.logout_user,name='logout'),
    path("login",views.login_user,name='login'),
    path("otp_verification",views.send_otp,name='send_otp'),
    path("verify_otp",views.verify_otp,name='verify_otp'),
    path("reset_password/",views.password_reset,name='reset_password'),
    path("signup",views.signup_user,name='signup'),
    path("profile/<username>",views.view_profile,name='profile'),
    path("edit_profile",views.edit_profile,name='edit_profile'),
    path("edit_password",views.change_password,name='change_password'),
    
]