# Manual de Usuario – Backend de Code Colony

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

## 4. Proceso de Uso  

### 4.1. Conexión al Servidor  
El cliente debe:  
1. Conectarse al servidor WebSocket en la misma URL del backend (ej. `ws://localhost:3000`).  
2. Emitir el evento `join_game` para identificarse (ej. con `playerId = "player1"`).  

### 4.2. Creación de Unidades  
Para crear una unidad, el cliente debe realizar una petición HTTP:  
- **Método**: `POST`  
- **Ruta**: `/api/game/spawn`  
- **Cuerpo**:  
  ```json
  {
    "playerId": "player1",
    "unitType": "Warrior"
  }
El sistema validará si el jugador tiene una colonia activa y suficientes recursos.

### 4.3. Reinicio del Juego
Para reiniciar la simulación:

- **Método**: `POST`  
- **Ruta**: `/api/game/reset`
No se requiere cuerpo en la petición. El sistema eliminará todas las entidades y regenerará el mundo inicial.
### 4.4. Gestión de Scripts
- **Subir script**: `POST /api/script/upload con playerId`, `unitType` y `code.`
- **Obtener scripts**: `GET /api/script/player1` devuelve todos los scripts registrados.
### 4.5. Recepción de Estado en Tiempo Real
El cliente debe escuchar los siguientes eventos desde el servidor:

- **game_tick**: Se emite cada 200 ms con el estado completo del juego (posición de unidades, salud, eventos visuales).
- **game_over**: Se emite cuando la colonia del jugador es destruida. El cliente debe mostrar un mensaje y permitir reiniciar.
## 5. Roles de Usuario y Permisos
El sistema no distingue roles en esta versión. Cualquier cliente que se conecte puede:

-Crear unidades (si tiene recursos).
-Recibir actualizaciones del estado del juego.
-Reiniciar la simulación.
Todas las acciones están limitadas por la lógica del juego (ej. no se pueden crear unidades sin una colonia viva).

## 6. Gestión de Entidades del Juego
Durante la partida, el cliente recibirá información sobre:

- **Unidades**: con atributos como posición, salud, velocidad y tipo (Warrior, Harvester, Monster).
- **Estructuras**: principalmente la Colony, con posición y estado de vida.
- **Recursos**: ubicados en el mapa, con cantidad disponible para recolectar.
Cada entidad incluye un identificador único (id) y un propietario (ownerId), permitiendo diferenciar unidades aliadas de enemigas.

## 7. Conclusiones
El backend de Code Colony ofrece una interfaz clara y eficiente para la integración con clientes externos. Su combinación de API REST y WebSockets permite tanto el control explícito de acciones como la sincronización automática del estado del juego. Su diseño modular y su adherencia a principios de POO lo convierten en una herramienta ideal para fines educativos y de simulación.