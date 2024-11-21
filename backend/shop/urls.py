from django.urls import path
from . import views

urlpatterns = [
    path('ping/', views.ping),
    path('signup/', views.signup, name='signup'),
    path('login/', views.login, name='login'),
    path('products/', views.get_products, name='products'),
    # path('products/<int:id>/', views.get_product, name='product'),
    path('inventory/', views.get_inventory, name='inventory'),
    path('inventory/add/', views.add_inventory, name='add_inventory'),
    path('order/', views.place_order, name='order'),
    path('deleteAll/', views.clear_db, name='deleteAll'),
    path('populate/', views.populate_db, name='populate'),
]