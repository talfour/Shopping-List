# Generated by Django 4.1.5 on 2023-03-06 10:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0007_alter_item_last_time_used'),
    ]

    operations = [
        migrations.AlterField(
            model_name='item',
            name='food_type',
            field=models.CharField(blank=True, choices=[('vegetables', 'vegetables'), ('fruits', 'fruits'), ('grains, beans and nuts', 'grains, beans and nuts'), ('meat and poultry', 'meat and poultry'), ('fish and seafood', 'fish and seafood'), ('dairy foods', 'dairy foods'), ('fat', 'fat'), ('sweets', 'sweets'), ('spices', 'spices')], max_length=100),
        ),
    ]