import os
from django.utils import timezone
import json
from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.contrib.auth.hashers import check_password, make_password
from django.forms.models import model_to_dict
from .models import User, Product,  Inventory, Order, Cart
import logging
import uuid
import base64
from PIL import Image
import io
import random



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
        user_id = user.id
        token = str(uuid.uuid4())
        request.session['auth_token'] = token
        print("auth" + request.session['auth_token'])
        return JsonResponse({'message': 'User created successfully', 'token': token, 'user_id': user_id})
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
                return JsonResponse({'message': 'Login successful', 'user': user.name, 'token': token, 'user_id': user.id, 'email': user.email, password: user.password})
            else:
                return JsonResponse({'error': 'Invalid password'}, status=401)
        except User.DoesNotExist:
            return JsonResponse({'error': 'Invalid credentials'}, status=401)
    else:
        return JsonResponse({'error': 'Only POST method is allowed'}, status=400)
    
@csrf_exempt
def update_password(request):
    if request.method == 'POST':
        user_id = request.POST.get('user_id')
        password = request.POST.get('password')
        # Hash the password before saving
        hashed_password = make_password(password)
        try:
            user = User.objects.get(id=user_id)
            user.password = hashed_password
            user.save()
            token = str(uuid.uuid4())
            request.session['auth_token'] = token
            return JsonResponse({'message': 'Password updated successfully', 'token': token})
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
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
    # error =  protected_view(request)
    # if not error is None:
    #     return error
    products = Product.objects.all()
    data = []
    for product in products:
        data.append({
            'id': product.id,
            'name': product.name,
            'description': product.description,
            'price': product.price,
            'date_added': product.date_added,
            'image': "" if not product.image else product.image.url
        })
    return JsonResponse(data, safe=False)

#get inventory
@csrf_exempt
def get_inventory(request):
    jdata = json.loads(request.body)
    user_id = jdata.get('user_id')
    inventory = Inventory.objects.all().exclude(user_id=user_id).exclude(category="Purchased")
    data = []
    for item in inventory:
        product_data = model_to_dict(item.product, exclude=['image'])
        product_data['image'] = item.product.image.url if item.product.image else ''
        data.append({
            'id': item.id,
            'user': model_to_dict(item.user,exclude=['password']),
            'product': product_data,
            'quantity': item.quantity,
            'date_added': item.date_added,
            'category': item.category
        })
    return JsonResponse(data, safe=False)

def get_inventory_by_id(request):
    if request.method == 'GET':
        user_id = request.GET.get('user_id')
        inventory = None
        try:
            inventory = Inventory.objects.filter(user_id=user_id)
        except Inventory.DoesNotExist:
            return JsonResponse({'error': 'Inventory not found'}, status=404)
        data = []
        for item in inventory:
            product_data = model_to_dict(item.product, exclude=['image'])
            product_data['image'] = item.product.image.url if item.product.image else ''
            data.append({
                'id': item.id,
                'user': model_to_dict(item.user, exclude=['password']),
                'product': product_data,
                'quantity': item.quantity,
                'date_added': item.date_added,
                'category': item.category
            })
        return JsonResponse(data, safe=False)


# Add to inventory
@csrf_exempt
def add_inventory(request):
    if request.method == 'POST':
        product_id = request.POST.get('product_id')
        quantity = request.POST.get('quantity')
        user_id = request.POST.get('user_id')

        product = None
        user = None
        if not product_id:
            p_name = request.POST.get('name')
            p_description = request.POST.get('description') 
            p_price = request.POST.get('price')
            # Handle image file upload
            if 'image' in request.FILES:
                image_file = request.FILES['image']
                # Convert image to base64
                image = Image.open(image_file)
                image = image.convert("RGB")
                image.thumbnail((300, 300), Image.LANCZOS)
                buffer = io.BytesIO()
                image.save(buffer, format="JPEG")
                encoded_image = base64.b64encode(buffer.getvalue()).decode('utf-8')
            else:
                encoded_image = ""
            product = Product(name=p_name, description=p_description, price=p_price, image=encoded_image)
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
                inventory = Inventory(product=savedProduct, quantity=quantity, user=user,category="Purchased")
                inventory.save()
            else:
                return JsonResponse({'error': 'Product not created'}, status=404)
        product_data = model_to_dict(inventory.product, exclude=['image'])
        product_data['image'] = inventory.product.image.url if inventory.product.image else ''
        data = []
        data.append({
            'id': inventory.id,
            'user': model_to_dict(inventory.user, exclude=['password']),
            'product': product_data,
            'quantity': inventory.quantity,
            'category': inventory.category
        })
        return JsonResponse({'message': 'Inventory added successfully','data': data}, status=201)
    else:
        return JsonResponse({'error': 'Only POST method is allowed'}, status=400)
    
@csrf_exempt
def update_product(request):
    if request.method == 'POST':
        jsonData = json.loads(request.body)
        product_id = jsonData.get('product_id')
        name = jsonData.get('name')
        description = jsonData.get('description')
        price = jsonData.get('price')
        product = None
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return JsonResponse({'error': 'Product not found'}, status=404)
        if name != None:
            product.name = name
        if description != None:
            product.description = description
        if price != None:
            print(price)
            product.price = price
        product.save()
        return JsonResponse({'message': 'Product updated successfully'})
    else:
        return JsonResponse({'error': 'Only POST method is allowed'}, status=400)
    


def get_cart(request):
    if request.method == 'GET':
        user_id = request.GET.get('user_id')
        cart = None
        try:
            cart = Cart.objects.get(user=user_id)
        except Cart.DoesNotExist:
            return JsonResponse({'error': 'Cart not found'}, status=404)
        response = {
            'user': model_to_dict(cart.user, exclude=['password']),
            'inventory': json.loads(cart.inventory.replace("'", '"'))
        }
        return JsonResponse(response, safe=False)
    else:
        return JsonResponse({'error': 'Only GET method is allowed'}, status=400)
    

@csrf_exempt
def update_cart(request):
    if request.method == 'POST':
        jsonData = json.loads(request.body)
        user_id = jsonData.get('user_id')
        cart = jsonData.get('cart')
        cartStr = json.dumps(cart)
        if not user_id:
            return JsonResponse({'error': 'User not found'}, status=404)
        if isinstance(cart, list):
            oldCart = None
            try:
                oldCart = Cart.objects.get(user=user_id)
            except Cart.DoesNotExist:
                pass
            if oldCart:
                oldCart.inventory = cartStr
                oldCart.save()
            else:
                user = User.objects.get(id=user_id)
                newCart = Cart(user=user,inventory=cartStr)
                newCart.save()
        else:
            return JsonResponse({'error': 'Invalid request'}, status=400)
        return JsonResponse({'message': 'Cart updated successfully'})
    else:
        return JsonResponse({'error': 'Only POST method is allowed'}, status=400)
        
    

    
# Order operations
@csrf_exempt
def place_order(request):
    if request.method == 'POST':
        body = json.loads(request.body)
        # body is a json arra
        oldInventory = []
        inventoryItemList = []
        if isinstance(body, list):
            for item in body:
                id = item.get('id')
                buyer_id = item.get('buyer_id')
                quantity = item.get('quantity')
                product = item.get('product')
                inventoryItem = None
                user = None
                try:
                    user = User.objects.get(id=buyer_id)
                except User.DoesNotExist:  
                    return JsonResponse({'error': 'Buyer not found'}, status=404)
                try:
                    inventoryItem = Inventory.objects.get(id = id)
                except Product.DoesNotExist:
                    return JsonResponse({'error': 'Product not found:', "errorCode": 40401, "productName":product['name']}, status=404 )
                if inventoryItem.quantity < int(quantity):
                    return JsonResponse({'error': 'Not enough stock', "errorCode": 40402, "productName":product['name']}, status=400)
                
                if(str(inventoryItem.product.price) != product['price']):
                    print(type(inventoryItem.product.price), type(product['price']))
                    cart = Cart.objects.get(user=buyer_id)
                    oldInventory = json.loads(cart.inventory)
                    for oldItem in oldInventory:
                        old_product = oldItem.get('product', {})
                        if old_product.get('id') == product.get('id'):
                            old_product['price'] = str(inventoryItem.product.price)
                            break
                    cart.inventory = json.dumps(oldInventory)
                    cart.save()
                    return JsonResponse({'error': 'Price mismatch ', "errorCode": 40403, "productName":product['name']}, status=400)
                
                total = inventoryItem.product.price * int(quantity)
                order = Order(inventoryItem=inventoryItem, user=user, quantity=quantity, total=total).save()
                inventoryItem.quantity -= int(quantity)
                if inventoryItem.quantity == 0:
                        inventoryItem.category = "Sold"

                existingItem = None
                try:
                    existingItem = Inventory.objects.get(user=user, product=inventoryItem.product, category="Purchased")
                except Inventory.DoesNotExist:
                    existingItem = None
                newItem = None
                if existingItem:
                    newItem = existingItem
                    newItem.quantity += int(quantity)
                else:
                    newItem = Inventory(
                        product=inventoryItem.product,
                        quantity=int(quantity),
                        category="Purchased",
                        user=user,
                        date_added=timezone.now().strftime('%Y-%m-%d %H:%M:%S')
                    )
                oldInventory.append(inventoryItem)
                inventoryItemList.append(newItem)     
        else:
            return JsonResponse({'error': 'Invalid request'},status=400)
        
        try:
            # ordser.save()
            print(len(inventoryItemList), len(oldInventory))
            for item, old_item in zip(inventoryItemList, oldInventory):
                print(F"item: {item.product.name}, old_item: {old_item.product.name}")
                print(item, old_item)
                item.save()
                old_item.save()
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
    Cart.objects.all().delete()
    return JsonResponse({'message': 'Database cleared successfully'})


def populate_db(request):
    # Clear the database
    clear_db(request)

    # Create 6 users
    users = []  
    for i in range(1, 7):
        hashed_password = make_password(f'pass{i}')
        user = User.objects.create(
            name=f'testuser{i}',
            email=f'testuser{i}@shop.aa',
            password=hashed_password
        )
        users.append(user)

    # For the first 3 users, add 10 products each to their inventory
    count = 1
    for user in users[:3]:
        for j in range(1, 11):
            # pick files from asset folder to poppuate the image field
            image_files = [
                './assets/img1.jpg',
                './assets/img2.jpg',
                './assets/img3.jpg',
                './assets/img5.jpg',
                './assets/img6.jpg',
            ]            
            image_path = random.choice(image_files)
            file_path = os.path.join(os.path.dirname(__file__), image_path)
            img = decode_image(file_path)
            product = Product.objects.create(
                name=f'Product {count}',
                description=f'Sample description {count}',
                price=(10.0 * j)%7,
                image= img
            )
            count += 1
            inventory = Inventory.objects.create(
                product=product,
                quantity=10,
                user=user
            )
           
    return JsonResponse({'message': 'Database populated successfully'})

def decode_image(image_path):
    with open(image_path, "rb") as image_file:
        image = Image.open(image_file)
        image = image.convert("RGB")
        image.thumbnail((300, 300), Image.LANCZOS)
        buffer = io.BytesIO()
        image.save(buffer, format="JPEG")
        encoded_string = base64.b64encode(buffer.getvalue()).decode('utf-8')
    return encoded_string