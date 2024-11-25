# Generated by Django 5.0.9 on 2024-11-24 10:29

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0007_inventory_date_added'),
    ]

    operations = [
        migrations.AlterField(
            model_name='inventory',
            name='date_added',
            field=models.CharField(default=django.utils.timezone.now, max_length=100),
        ),
        migrations.AlterField(
            model_name='product',
            name='date_added',
            field=models.CharField(default='2024-11-24 10:29:15', max_length=100),
        ),
        migrations.AlterField(
            model_name='product',
            name='updated_at',
            field=models.CharField(default='2024-11-24 10:29:15', max_length=100),
        ),
    ]
