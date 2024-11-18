from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.contrib.auth.hashers import check_password, make_password
from .models import User


# Create your views here.

def ping(request):
    # return HttpResponse(f"Hello, World!")
    return render(request, 'hello.html')

@csrf_exempt
def signup(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        email = request.POST.get('email')
        password = request.POST.get('password')

        # Check if user already exists
        if User.objects.filter(email=email).exists():
            return JsonResponse({'error': 'Email already registered'}, status=400)

        # Hash the password before saving
        hashed_password = make_password(password)

        # Create and save the new user
        user = User(name=name, email=email, password=hashed_password)
        user.save()

        return JsonResponse({'message': 'User created successfully'})
    else:
        return JsonResponse({'error': 'Only POST method is allowed'}, status=400)

@csrf_exempt
def login(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        # Authenticate user
        try:
            user = User.objects.get(email=email)
            print(user.password, password)
            if check_password(password, user.password):
                return JsonResponse({'message': 'Login successful', 'user': user.name})
            else:
                return JsonResponse({'error': 'Invalid password'}, status=401)
        except User.DoesNotExist:
            return JsonResponse({'error': 'Invalid credentials'}, status=401)
    else:
        return JsonResponse({'error': 'Only POST method is allowed'}, status=400)