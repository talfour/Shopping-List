# Generated by Django 4.1.5 on 2023-01-25 09:44

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0006_item_food_type_alter_item_last_time_used'),
    ]

    operations = [
        migrations.AlterField(
            model_name='item',
            name='last_time_used',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]