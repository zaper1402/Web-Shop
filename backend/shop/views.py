import json
from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.contrib.auth.hashers import check_password, make_password
from django.forms.models import model_to_dict
from .models import User, Product,  Inventory, Order
import logging
import uuid



# Create your views here.

def ping(request):
    # return HttpResponse(f"Hello, World!")
    return render(request, 'hello.html')

# User operations
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
        token = str(uuid.uuid4())
        request.session['auth_token'] = token
        print("auth" + request.session['auth_token'])
        return JsonResponse({'message': 'User created successfully', 'token': token})
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
                token = str(uuid.uuid4())
                request.session['auth_token'] = token
                print("auth" + request.session['auth_token'])
                return JsonResponse({'message': 'Login successful', 'user': user.name, 'token': token})
            else:
                return JsonResponse({'error': 'Invalid password'}, status=401)
        except User.DoesNotExist:
            return JsonResponse({'error': 'Invalid credentials'}, status=401)
    else:
        return JsonResponse({'error': 'Only POST method is allowed'}, status=400)

def protected_view(request):
    token = request.headers.get('Authorization')
    print(f"token: {token} session: {request.session.get('auth_token')}")
    if token != None and token == request.session.get('auth_token'):
        # Token is valid
        return None
    else:
        return JsonResponse({'error': 'Unauthorized'}, status=401)

# Product operations
def get_products(request):
    error =  protected_view(request)
    if not error is None:
        return error
    products = Product.objects.all()
    data = []
    for product in products:
        data.append({
            'id': product.id,
            'name': product.name,
            'description': product.description,
            'price': product.price,
            'image': "" if not product.image else product.image.url
        })
    return JsonResponse(data, safe=False)

#get inventory
def get_inventory(request):
    inventory = Inventory.objects.all()
    data = []
    for item in inventory:
        product_data = model_to_dict(item.product, exclude=['image'])
        product_data['image'] = item.product.image.url if item.product.image else ''
        data.append({
            'id': item.id,
            'user': model_to_dict(item.user),
            'product': product_data,
            'quantity': item.quantity
        })
    return JsonResponse(data, safe=False)


# Add to inventory
@csrf_exempt
def add_inventory(request):
    if request.method == 'POST':
        body = json.loads(request.body)
        logging.debug(body)
        product_id = body.get('product_id')
        quantity = body.get('quantity')
        user_id = body.get('user_id')

        product = None
        user = None
        if not product_id:
            p_name = body.get('name')
            p_description = body.get('description')
            p_price = body.get('price')
            product = Product(name=p_name, description=p_description, price=p_price)
        else:
            try:
                product = Product.objects.get(id=product_id)
            except Product.DoesNotExist:
                return JsonResponse({'error': 'Product not found or no new product to be added'}, status=404)

        if user_id:
            user = User.objects.get(id=user_id)
        else:
            return JsonResponse({'error': 'User not found'}, status=404)

        try:
            inventory = Inventory.objects.get(product_id=product)
            inventory.quantity += int(quantity)
            inventory.save()
        except:
            savedProduct, created = Product.objects.get_or_create(name=product.name, description=product.description, price=product.price)
            if savedProduct:
                inventory = Inventory(product=savedProduct, quantity=quantity, user=user)
                inventory.save()
            else:
                return JsonResponse({'error': 'Product not created'}, status=404)
        return JsonResponse({'message': 'Inventory added successfully'})
    else:
        return JsonResponse({'error': 'Only POST method is allowed'}, status=400)
    

    
# Order operations
@csrf_exempt
def place_order(request):
    if request.method == 'POST':
        body = json.loads(request.body)
        # body is a json arra
        inventoryItemList = []
        if isinstance(body, list):
            for item in body:
                print(item)
                id = item.get('id')
                quantity = item.get('quantity')
                inventoryItem = None
                user = None
                try:
                    inventoryItem = Inventory.objects.get(id = id)
                except Product.DoesNotExist:
                    return JsonResponse({'error': 'Product not found'}, status=404)
                
                total = inventoryItem.product.price * int(quantity)
                order = Order(inventoryItem=inventoryItem, user=user, quantity=quantity, total=total)
                inventoryItem.quantity -= int(quantity)
                inventoryItemList.append(inventoryItem)
                
        else:
            return JsonResponse({'error': 'Invalid request'},status=400)
        try:
            # ordser.save()
            for item in inventoryItemList:
                item.save()
                return JsonResponse({'message': 'Order placed successfully'})
        except Exception as e:
            return JsonResponse({'error': 'Failed to place order'}, status=500)
    else:
        return JsonResponse({'error': 'Only POST method is allowed'}, status=400)
    
#clear database
def clear_db(request):
    Order.objects.all().delete()
    Inventory.objects.all().delete()
    Product.objects.all().delete()
    User.objects.all().delete()
    return JsonResponse({'message': 'Database cleared successfully'})


def populate_db(request):
    # Clear the database
    clear_db(request)

    # Create 6 users
    users = []  
    for i in range(1, 7):
        user = User.objects.create(
            name=f'testuser{i}',
            email=f'testuser{i}@shop.aa',
            password=f'pass{i}'
        )
        users.append(user)

    # For the first 3 users, add 10 products each to their inventory
    count = 1
    for user in users[:3]:
        for j in range(1, 11):
            product = Product.objects.create(
                name=f'Product {count}',
                description=f'Sample description {count}',
                price=(10.0 * j)%7,
                image='path/to/default/image.jpg'  # Update with a valid image path
            )
            count += 1
            Inventory.objects.create(
                product=product,
                quantity=10,
                user=user
            )

    return JsonResponse({'message': 'Database populated successfully'})