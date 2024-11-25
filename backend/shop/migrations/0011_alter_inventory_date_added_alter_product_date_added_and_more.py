# Generated by Django 5.0.9 on 2024-11-24 17:06

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0010_inventory_category_alter_inventory_date_added_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='inventory',
            name='date_added',
            field=models.CharField(default='2024-11-24 17:06:51', max_length=100),
        ),
        migrations.AlterField(
            model_name='product',
            name='date_added',
            field=models.CharField(default='2024-11-24 17:06:51', max_length=100),
        ),
        migrations.CreateModel(
            name='Cart',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_added', models.CharField(default='2024-11-24 17:06:51', max_length=100)),
                ('inventory', models.ManyToManyField(to='shop.inventory')),
                ('user_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='shop.user')),
            ],
        ),
    ]
