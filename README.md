# CC - Code Colony

 > Descripción Temporal

CodeColony es una aplicación web interactiva, con un enfoque propio centrado en la enseñanza y aplicación avanzada de la Programación Orientada a Objetos (POO) mediante TypeScript.

El usuario podrá crear y gestionar una colonia virtual cuyos elementos (unidades, estructuras, recursos, etc.) se controlan a través de código. Cada elemento del juego será un objeto programable que representará entidades con relaciones, herencias y comportamientos definidos.

El objetivo es ofrecer una experiencia tanto lúdica como educativa, donde los jugadores apliquen conceptos de programación en un entorno visual e interactivo.

### Integrantes del equipo

 - [ ] Basurco Casani, Jeferson Joao
 - [ ] Betanzos Rosas, Taylor Anthony
 - [ ] Ccosco Alvis, Italo Frankdux
 - [ ] Pachari Quispe, Jorge Pachari
 - [ ] Huayhua Hillpa, Yourdyy Yossimar
 
## Tecnologías a utilizar

 - TypeScript
 - Node.js
 - Express
 - HTML
 - CSS
 - Docker
 - Git y GitHub

## Plan de trabajo — 5 semanas aproximadamente
### Semana 1 — Fundamentos y arquitectura

_Objetivo:_ Tener la base sólida del proyecto lista para desarrollar.
Tareas:
 - [ ] Configurar entorno de desarrollo con Node.js, TypeScript y Express.
 - [ ] Configurar Docker para ejecución del proyecto.
 - [ ] Diseñar la estructura de carpetas (backend, frontend, assets, etc.).
 - [ ] Escribir documentación inicial 
 - [ ] Implementar un servidor Express que sirva una página base con un mensaje inicial.

 > Entregable: Proyecto ejecutable en Docker y corriendo con un servidor Express básico.

---
### Semana 2 — Lógica del juego y modelo de objetos (POO)

_Objetivo:_ Implementar el sistema base de entidades y comportamiento del juego.
Tareas:
 - [ ] Definir las clases principales: Unidad, Estructura, Recurso, Jugador.
 - [ ] Implementar relaciones entre objetos.
 - [ ] Crear un controlador del mundo (GameEngine) que gestione el estado global.
 - [ ] Agregar simulación básica (tick del juego o ciclo de actualización).
 - [ ] Permitir modificar o crear objetos mediante código del usuario (por consola o editor embebido).

 > Entregable: Motor lógico del juego ejecutándose desde Node, con entidades funcionales.

---
### Semana 3 — Interfaz web interactiva

_Objetivo:_ Crear la base visual del juego en el navegador.
Tareas:
 - [ ] Crear frontend HTML + CSS + TypeScript
 - [ ] Mostrar un canvas 2D con las entidades del mundo.
 - [ ] Renderizar posiciones y estados de las unidades y estructuras.
 - [ ] Sincronizar datos con el backend via REST y WebSocket básico.
 - [ ] Mostrar una consola o panel para escribir código y controlar entidades.

 > Entregable: Mundo visual básico donde se ve movimiento o interacción simple.

---
### Semana 4 — Programación del usuario y simulación avanzada

_Objetivo:_ Hacer que el jugador pueda controlar objetos mediante código.
Tareas:
 - [ ] Implementar un intérprete o sandbox de scripts.
 - [ ] Permitir que los usuarios escriban código para manejar sus unidades.
 - [ ] Integrar estas acciones con el motor (GameEngine).
 - [ ] Agregar validaciones y mensajes de error legibles.
 - [ ] Añadir persistencia temporal (estado del mundo en memoria o JSON).

 > Entregable: Jugador puede escribir código para manipular entidades dentro del juego.

---
### Semana 5 — Pulido, visuales y despliegue

_Objetivo:_ Convertirlo en un producto completo y presentable.
Tareas:
 - [ ] Mejorar la interfaz (colores, iconos, efectos visuales básicos).
 - [ ] Añadir panel de control para reiniciar mundo o cargar scripts.
 - [ ] Documentar API interna y estructura de clases.
 - [ ] Integrar Docker Compose para correr backend y frontend juntos.
 - [ ] Desplegar en Railway o AWS-EC2.
 - [ ] Crear presentación final del proyecto.

 > Entregable: Versión funcional de CodeColony lista.