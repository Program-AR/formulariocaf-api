# Docker Container

## PRE-REQUISITOS

### Instalación de docker
Descargar e instalar la version de Docker correspondiente a su sistema operativo (disponible solo para sistemas x64).

> https://www.docker.com/products/docker-desktop

## SETUP INICIAL
1- Clonar el repositorio

2- Copiar archivo `.env.example` a `.env`

3- Copiar archivo `.docker/.env.example` a `.docker/.env`, realizar ajustes en caso de ser necesario

4- Abrir una Terminal (Linux/Mac)

5- Navegar al directorio .docker relativo a la raiz del desarrollo
   ```bash
   $ cd .docker
   ```

6- Buildear los contenedores

   ```bash
   $ docker-compose up -d
   o
   $ docker compose up -d
   ```

7- Verificar el estado de los contenedores (debe decir UP)

   ```bash
   $ docker-compose ps
   o
   $ docker compose ps
   ```

### Comandos Útiles

# MODO DE DETENER LOS CONTENEDORES

   ```bash
   $ docker-compose stop
   o
   $ docker compose stop
   ```

# MODO DE INICIAR LOS CONTENEDORES

   ```bash
   $ docker-compose start
      o
   $ docker compose start

   ```