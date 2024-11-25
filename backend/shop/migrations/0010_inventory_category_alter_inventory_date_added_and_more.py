# Generated by Django 5.0.9 on 2024-11-24 13:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0009_remove_product_updated_at_alter_inventory_date_added_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='inventory',
            name='category',
            field=models.CharField(choices=[('onSale', 'onSale'), ('Sold', 'Sold'), ('Purchased', 'Purchased')], default='onSale', max_length=100),
        ),
        migrations.AlterField(
            model_name='inventory',
            name='date_added',
            field=models.CharField(default='2024-11-24 13:19:14', max_length=100),
        ),
        migrations.AlterField(
            model_name='product',
            name='date_added',
            field=models.CharField(default='2024-11-24 13:19:14', max_length=100),
        ),
    ]
