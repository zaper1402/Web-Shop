# Generated by Django 5.0.9 on 2024-11-24 10:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0008_alter_inventory_date_added_alter_product_date_added_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='product',
            name='updated_at',
        ),
        migrations.AlterField(
            model_name='inventory',
            name='date_added',
            field=models.CharField(default='2024-11-24 10:32:36', max_length=100),
        ),
        migrations.AlterField(
            model_name='product',
            name='date_added',
            field=models.CharField(default='2024-11-24 10:32:36', max_length=100),
        ),
    ]