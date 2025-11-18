#!/bin/bash

# Activate virtual environment
source Backend/venv/Scripts/activate

# Navigate to the backend directory and run the Django server
cd Backend/backend_service
python manage.py runserver 0.0.0.0:8000 &

# # Navigate to the frontend directory and start the Vue development server
cd ../../
npm --prefix Frontend/vue-frontend run dev

