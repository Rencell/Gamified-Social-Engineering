#!/bin/bash

# Activate virtual environment
source Backend/venv/Scripts/activate

# Navigate to the backend directory and run the Django server
cd Backend/backend_service
daphne -b 0.0.0.0 -p 8000 backend_service.asgi:application &

# # Navigate to the frontend directory and start the Vue development server
cd ../../
npm --prefix Frontend/vue-frontend run dev






