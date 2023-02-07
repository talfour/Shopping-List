# Shopping-List
Simple shopping list App

## Build docker image first using command:
docker-compose build

## Run migrations:
docker-compose run --rm app sh -c "python manage.py makemigrations && python manage.py migrate"

## To run tests in docker:
docker-compose run --rm app sh -c "python manage.py test && flake8"

## Run App:
docker-compose up
