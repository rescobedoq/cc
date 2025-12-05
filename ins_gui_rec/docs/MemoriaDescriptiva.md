# Memoria Descriptiva del Backend – Code Colony

## 1. Introducción  
La presente memoria descriptiva documenta el funcionamiento, instalación y uso del backend del juego **Code Colony**, desarrollado en **TypeScript** sobre **Node.js** y utilizando una arquitectura modular con controladores HTTP y gestión de eventos en tiempo real mediante WebSockets. Esta aplicación es el núcleo lógico de un entorno de simulación educativa, diseñado para que los usuarios comprendan principios de **Programación Orientada a Objetos (POO)** mediante la creación y gestión de colonias en tiempo real a través de comandos. Los usuarios principales son los **clientes frontend** (jugadores) que interactúan con el sistema enviando órdenes que controlan unidades, estructuras y recursos dentro del juego.

## 2. Arquitectura y Plataforma Tecnológica  
Code Colony es una aplicación backend desarrollada en **TypeScript** y ejecutada sobre **Node.js**. Utiliza el framework **Express** para la gestión de rutas HTTP y **Socket.IO** para la comunicación en tiempo real mediante WebSockets. El entorno de ejecución incluye **Node.js v18+**, las dependencias definidas en `package.json` (incluyendo `express`, `socket.io`, `cors`, `uuid`) y el compilador oficial de TypeScript (`tsc`). La aplicación está diseñada para funcionar en cualquier sistema operativo compatible con Node.js (Windows, Linux, macOS).

## 3. Funcionalidades del Sistema  
Code Colony permite la gestión completa de una colonia en tiempo real. Sus principales funcionalidades incluyen:  
- **Creación y gestión de unidades**: Los jugadores pueden generar unidades de tipo *Warrior* o *Harvester* mediante la API REST.  
- **Gestión de estructuras y recursos**: El sistema incluye una colonia base y recursos distribuidos en el mapa que pueden ser recolectados.  
- **API RESTful**: Expone endpoints para acciones clave del juego, como crear unidades (`/api/game/spawn`) y reiniciar el mundo (`/api/game/reset`).  
- **Comunicación en tiempo real**: Utiliza WebSockets para notificar a los clientes cada cambio en el estado del juego (movimientos, combates, eventos visuales).  
- **Motor de juego centralizado**: El `GameEngine` gestiona el ciclo de juego, actualiza entidades, resuelve colisiones y valida reglas.  
- **Carga de scripts personalizados**: Los jugadores pueden subir fragmentos de código asociados a tipos de unidad, preparando el sistema para comportamientos programables.

## 4. Proceso de Instalación  
La instalación del backend de Code Colony requiere la configuración de un entorno Node.js. Posteriormente, se deben realizar los siguientes pasos:  
1. Clonar el repositorio del proyecto o copiar la carpeta del backend.  
2. Navegar a la raíz del proyecto y ejecutar `npm install` para instalar todas las dependencias.  
3. Compilar el código TypeScript con el comando `npm run tsc`.  
4. Ejecutar el servidor con `npm start` (equivalente a `node build/index.js`).  
5. (Opcional, para desarrollo) Usar `npm run dev` para iniciar el servidor con reinicio automático.  

Una vez iniciado, el backend escucha en el puerto configurado (por defecto 3000) y está listo para aceptar conexiones HTTP y WebSocket desde clientes frontend.

## 5. Roles de Usuario y Permisos  
El sistema no implementa roles de usuario diferenciados. Cada conexión desde un cliente frontend representa a un **jugador único** (actualmente diseñado para un jugador principal, "player1"). Todas las acciones disponibles a través de la API REST o WebSockets están orientadas a la gestión de la colonia y unidades del jugador. El backend valida internamente que las acciones sean válidas según el estado del juego (por ejemplo, que exista una colonia viva y que se disponga de suficientes recursos).

## 6. Gestión de Entidades del Juego  
Los administradores (en este caso, el propio sistema) y los jugadores pueden interactuar con las entidades del juego. Cada entidad tiene atributos específicos y comportamientos definidos:  

- **Unidades**: Clases como `Warrior` y `Harvester` heredan de `Unit`, y tienen propiedades como vida, posición, velocidad y daño.  
- **Estructuras**: Clases como `Colony` representan edificios con funciones específicas (producción de unidades, base del jugador).  
- **Recursos**: Representan elementos coleccionables en el mapa con una cantidad fija.  
- **Configuración del Juego**: Parámetros como salud inicial, costos de construcción o radio de acción se definen en `constants.ts` y en los constructores de las entidades.  

El sistema permite:  
- Crear nuevas entidades dinámicamente (ej. al invocar una unidad).  
- Actualizar su estado durante la partida (posición, salud).  
- Eliminarlas cuando son destruidas o completan su misión.

## 7. Conclusiones  
Code Colony es una solución integral para gestionar una simulación educativa de estrategia en tiempo real, con un sistema modular y accesible desde cualquier cliente compatible. Su implementación adecuada permite una comprensión clara de los conceptos de Programación Orientada a Objetos, mientras ofrece una experiencia inmersiva para el jugador. La arquitectura limpia y la separación de capas facilitan su mantenimiento, escalabilidad y futuras extensiones.