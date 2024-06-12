# Dockerfile

# Usar una imagen base de Python
FROM python:3.9

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos de requerimientos
COPY requirements.txt .

# Instalar las dependencias
RUN pip install -r requirements.txt

# Copiar el contenido del proyecto al contenedor
COPY . .

# Ejecutar el servidor de desarrollo de Django
	CMD ["python", "veterinaria/manage.py", "runserver", "0.0.0.0:8000"]
