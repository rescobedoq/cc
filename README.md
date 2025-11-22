# Code Colony - CC

**Desarrollo de una Plataforma Web Educativa para Simulación de Colonias Inteligentes mediante Programación Orientada a Objetos**

---

## Descripción del Proyecto

Code Colony es una plataforma web educativa que combina elementos de simulación y programación para crear un entorno de aprendizaje interactivo. Inspirado conceptualmente en principios de juegos de simulación, el proyecto se centra específicamente en la enseñanza práctica de Programación Orientada a Objetos utilizando TypeScript como lenguaje principal.

Los usuarios interactúan con una colonia virtual donde cada componente del sistema - unidades, estructuras, recursos y medio ambiente - funciona como un objeto programable. Esta aproximación permite experimentar directamente con conceptos avanzados de POO dentro de un contexto visual y tangible.

---

## Equipo de Desarrollo

 - [ ] Basurco Casani, Jeferson Joao 
 - [ ] Betanzos Rosas, Taylor Anthony 
 - [ ] Ccosco Alvis, Italo Frankdux 
 - [ ] Pachari Quispe, Jorge Pachari 
 - [ ] Huayhua Hillpa, Yourdyy Yossimar

---

## Objetivos del Proyecto

### Objetivo Principal

Crear una plataforma web de simulación que permita a los usuarios aplicar principios de Programación Orientada a Objetos mediante la codificación de comportamientos para entidades virtuales en un entorno controlado y visualmente representado.

### Objetivos Técnicos Específicos

- Implementar un sistema de herencia y polimorfismo que permita a los usuarios extender funcionalidades base mediante código TypeScript
- Desarrollar un motor de simulación que gestione ciclos de vida de entidades y relaciones entre objetos
- Construir una interfaz visual que represente el estado del mundo simulado y las interacciones entre entidades
- Crear un sistema de ejecución segura para código de usuario con limitaciones de acceso y recursos
- Establecer una arquitectura modular que facilite la expansión futura del proyecto

---

## Alcance Funcional

### Características Principales

- Simulación de colonias con entidades programables y sistemas de recursos
- Editor de código integrado con soporte para TypeScript y características de IDE
- Motor de ejecución seguro para código de usuario con límites de recursos
- Sistema de persistencia para guardar el estado de las colonias
- Visualización en tiempo real de la simulación mediante tecnologías web nativas
- API para interacción programática con las entidades del mundo virtual

### Limitaciones Iniciales

- Soporte para un número limitado de entidades simultáneas en la primera versión
- Subconjunto específico de características de TypeScript disponible para código de usuario
- Escenarios de simulación predefinidos con posibilidad de expansión posterior

---

## Arquitectura Técnica

### Componentes Frontend

- Aplicación web construida con TypeScript 
- Motor de renderizado utilizando Canvas 2D para representación gráfica
- Editor de código basado en Monaco Editor con soporte para TypeScript
- Sistema de componentes para la interfaz de usuario del dashboard
- Cliente WebSocket para comunicación en tiempo real con el backend

### Componentes Backend

- Servidor Node.js con Express para API RESTful
- Servicio de WebSockets para actualizaciones en tiempo real
- Motor de simulación que ejecuta la lógica del mundo virtual
- Sandbox de ejecución para código de usuario con límites de seguridad
- Servicio de base de datos para persistencia del estado del juego
- Sistema de colas para procesamiento asíncrono de tareas

---

## Plan de trabajo — 5 semanas aproximadamente

### Semana 1 — Fundamentos y arquitectura
 > Objetivo: Tener la base sólida del proyecto lista para desarrollar. Tareas:

 - [p] Configurar entorno de desarrollo con Node.js, TypeScript y Express.
 - [p] Configurar Docker para ejecución del proyecto.
 - [p] Diseñar la estructura de carpetas (backend, frontend, assets, etc.).
 - [p] Escribir documentación inicial
 - [p] Implementar un servidor Express que sirva una página base con un mensaje inicial.

 Entregable: Proyecto ejecutable en Docker y corriendo con un servidor Express básico.

### Semana 2 — Lógica del juego y modelo de objetos (POO)
 > Objetivo: Implementar el sistema base de entidades y comportamiento del juego. Tareas:

 - [p] Definir las clases principales como Unidad, Estructura, Recurso, Jugador.
 - [p] Implementar relaciones entre objetos.
 - [p] Crear un controlador del mundo (GameEngine) que gestione el estado global.
 - [p] Agregar simulación básica (tick del juego o ciclo de actualización).
 - [p] Permitir modificar o crear objetos mediante código del usuario (por consola o editor embebido).
 
 Entregable: Motor lógico del juego ejecutándose desde Node, con entidades funcionales.

### Semana 3 — Interfaz web interactiva
 > Objetivo: Crear la base visual del juego en el navegador. Tareas:

 - [ ] Crear frontend HTML + CSS + TypeScript
 - [ ] Mostrar un canvas 2D con las entidades del mundo.
 - [ ] Renderizar posiciones y estados de las unidades y estructuras.
 - [ ] Sincronizar datos con el backend via REST y WebSocket básico.
 - [ ] Mostrar una consola o panel para escribir código y controlar entidades.
 
 Entregable: Mundo visual básico donde se ve movimiento o interacción simple.

### Semana 4 — Programación del usuario y simulación avanzada
 > Objetivo: Hacer que el jugador pueda controlar objetos mediante código. Tareas:

 - [ ] Implementar un intérprete o sandbox de scripts.
 - [ ] Permitir que los usuarios escriban código para manejar sus unidades.
 - [ ] Integrar estas acciones con el motor (GameEngine).
 - [ ] Agregar validaciones y mensajes de error legibles.
 - [ ] Añadir persistencia temporal (estado del mundo en memoria o JSON).
 
 Entregable: Jugador puede escribir código para manipular entidades dentro del juego.

### Semana 5 — Pulido, visuales y despliegue
 > Objetivo: Convertirlo en un producto completo y presentable. Tareas:

 - [ ] Mejorar la interfaz (colores, iconos, efectos visuales básicos).
 - [ ] Añadir panel de control para reiniciar mundo o cargar scripts.
 - [ ] Documentar API interna y estructura de clases.
 - [ ] Integrar Docker Compose para correr backend y frontend juntos.
 - [ ] Desplegar en Railway o AWS-EC2.
 - [ ] Crear presentación final del proyecto.

 Entregable: Versión funcional de CodeColony lista.
