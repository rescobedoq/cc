### Instrucciones para ejecutar el proyecto

1. Asegúrate de tener Docker y Docker Compose instalados en tu máquina.
2. Clona este repositorio en tu máquina local.
3. Navega al directorio raíz del proyecto donde se encuentra el archivo `docker-compose.yml`.
4. Ejecuta el siguiente comando para construir y levantar los contenedores:

   ```bash
   docker-compose up --build
   ```
5. Una vez que los contenedores estén en funcionamiento, podrás acceder a la aplicación frontend en tu navegador web en la siguiente URL:

   ```http://localhost:5173```

 > Esto en local, pero entre contenedores se deben referenciar usando los nombres de servicio definidos en el `docker-compose.yml`.

6. La API backend estará disponible en:

   ```http://localhost:3000```

¡Listo! Ahora deberías tener tanto el frontend como el backend corriendo en contenedores Docker.

### Comandos útiles
# Levanta los contenedores
docker-compose up

# Si instalas nuevas dependencias:
docker-compose down
docker-compose build
docker-compose up