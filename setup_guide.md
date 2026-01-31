# Django Project -- Setup & Development Notes

## 1. Prerequisites

### Check Python Installation

``` bash
python3 --version
```

If Python is not installed:

``` bash
brew install python3
python3 --version
```

------------------------------------------------------------------------

## 2. Virtual Environment Setup

### Create Virtual Environment

``` bash
/opt/homebrew/bin/python3 -m venv django-venv
```

### Activate Virtual Environment

``` bash
source django-venv/bin/activate
```

------------------------------------------------------------------------

## 3. Install Core Dependencies

### Install Django

``` bash
pip install django
django-admin --version
```

### Install Django REST Framework

``` bash
pip install djangorestframework
python3 -c "import rest_framework; print(rest_framework.__version__)"
```

### Install Pillow (Image Handling)

``` bash
pip install Pillow
python3 -c "from PIL import Image; print(Image.__version__)"
```

------------------------------------------------------------------------

## 4. Database Setup

### Apply Migrations

``` bash
python3 manage.py migrate
```

------------------------------------------------------------------------

## 5. Django Admin & Users

### Open Django Shell

``` bash
python3 manage.py shell
```

### View Superusers

``` python
from django.contrib.auth.models import User
User.objects.filter(is_superuser=True).values('username', 'email')
```

Exit shell:

``` python
exit()
```

------------------------------------------------------------------------

### Change User Password

``` bash
python3 manage.py changepassword Govindp47
```

------------------------------------------------------------------------

## 6. Run Development Server

``` bash
python3 manage.py runserver
```

### URLs

- **Development Server:** <http://127.0.0.1:8000/>
- **Admin Panel:** <http://127.0.0.1:8000/admin/>

Stop server:

``` bash
Ctrl + C
```

Deactivate virtual environment:

``` bash
deactivate
```

------------------------------------------------------------------------

## 7. Dependency Management (pip-tools)

### Install pip-tools

``` bash
pip install pip-tools
```

### Compile Dependencies

``` bash
pip-compile requirements.in
```

### Install from Lock File

``` bash
pip install -r requirements.txt
pip list
```

------------------------------------------------------------------------

## ✅ Notes

- Never commit `django-venv/` to Git
- Commit both `requirements.in` and `requirements.txt`
- Always activate venv before running Django commands
