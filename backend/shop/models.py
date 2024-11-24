from django.utils import timezone
from django.db import models

# Create your models here.

class User(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)

    def __str__(self):
        return self.name
    
class Product(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='products/')
    # add current time as default value
    date_added = models.CharField(max_length=100, default= timezone.now().strftime('%Y-%m-%d %H:%M:%S'))
    def __str__(self):
        return self.name
    
class Inventory(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date_added = models.CharField(max_length=100, default= timezone.now().strftime('%Y-%m-%d %H:%M:%S'))
    # add category with enum of "onSale", "Sold", "Purchased"
    category = models.CharField(max_length=100, default="onSale", choices=[("onSale", "onSale"), ("Sold", "Sold"), ("Purchased", "Purchased")])
    def __str__(self):
        return self.product.name


class Order(models.Model):
    inventoryItem = models.ForeignKey(Inventory, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    total = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.product.name

    