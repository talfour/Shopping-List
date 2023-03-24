# Shopping Lists
Shopping Lists is a web application that allows users to create and manage shopping lists. Users can create new lists, add items to their lists, and remove items from the list. Each Item in the list can be modified and contain some description information as well as type of the item can be change for better sorting. The application is built using Django Rest Framework as Backend API and React, styled with styled-components.

JWT is used for authentication and it is stored in http-cookie.

# Features
- Create new shopping lists
- Add Users to the list
- Remove Users from the list
- Add items to shopping lists
- Update items
- Remove items from the shopping lists
- Delete shopping lists
- Edit shopping lists
- Responsive design


# Installation
Clone the repository:
`git clone https://github.com/talfour/Shopping-List.git`
Build docker image:
`docker-compose build`
Run migrations:
`docker-compose run --rm app sh -c "python manage.py makemigrations && python manage.py migrate"`
Run tests:
`docker-compose run --rm app sh -c "python manage.py test && flake8"`
Run development server:
`docker-compose up`
