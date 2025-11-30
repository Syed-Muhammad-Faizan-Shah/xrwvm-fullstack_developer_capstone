from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator

# Car Make
class CarMake(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

# Car Model
class CarModel(models.Model):
    car_make = models.ForeignKey(CarMake, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    dealer_id = models.IntegerField(default=1)

    CAR_TYPES = [
        ('SEDAN', 'Sedan'),
        ('SUV', 'SUV'),
        ('WAGON', 'Wagon'),
        ('COUPE', 'Coupe'),
        ('HATCH', 'Hatchback'),
        ('TRUCK', 'Truck'),
    ]
    type = models.CharField(max_length=10, choices=CAR_TYPES, default='SUV')

    year = models.IntegerField(
        default=2023,
        validators=[MaxValueValidator(2023), MinValueValidator(2015)]
    )

    def __str__(self):
        return f"{self.car_make.name} - {self.name}"
