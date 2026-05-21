#!/bin/bash

# Activate virtual environment
source Backend/venv/Scripts/activate

# Navigate to the backend directory and run the Django server
cd Backend/backend_service
src/services/vishingService.ts(6,81) &

# # Navigate to the frontend directory and start the Vue development server
cd ../../
npm --prefix Frontend/vue-frontend run dev





