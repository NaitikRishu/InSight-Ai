# Use an official Python runtime as a parent image
FROM python:3.9-slim

WORKDIR /app

# Copy the requirements file
COPY requirements.txt ./

# Install the dependencies globally (no venv)
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Make port 5002 available
EXPOSE 5002

# Command to run the app
# Use -u for unbuffered output (better logging)
CMD ["python", "-u", "ai_service.py"]