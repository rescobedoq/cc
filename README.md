# CodeColony

## Descripción

**CodeColony** es una aplicación web interactiva para aprender y practicar **Programación Orientada a Objetos (POO)** usando **TypeScript**.  

Los jugadores crean y gestionan una colonia virtual cuyos elementos —unidades, estructuras, recursos, etc.— se controlan mediante código. Cada entidad del juego será un **objeto programable** con sus propias relaciones, herencias y comportamientos.  

El objetivo es ofrecer una experiencia **educativa y lúdica**, aplicando conceptos de programación en un entorno visual e interactivo.

---

## Equipo

- Basurco Casani, Jeferson Joao  
- Betanzos Rosas, Taylor Anthony  
- Ccosco Alvis, Italo Frankdux  
- Pachari Quispe, Jorge Pachari  
- Huayhua Hillpa, Yourdyy Yossimar  

---

## Tecnologías

- **Lenguajes:** TypeScript, HTML, CSS  
- **Backend:** Node.js, Express  
- **Contenedores:** Docker  
- **Control de versiones:** Git y GitHub  

---

## Estructura del proyecto

CodeColony/
├─ backend/ # Servidor y lógica del juego
├─ frontend/ # Interfaz web
├─ assets/ # Imágenes y recursos gráficos
├─ scripts/ # Scripts de inicialización y utilidades
├─ docker/ # Configuraciones Docker y Compose
└─ README.md # Documentación


---

## Plan de trabajo

### Semana 1 — Fundamentos y arquitectura
**Objetivo:** Base sólida del proyecto  
**Tareas:**
- Configurar entorno (Node.js, TypeScript, Express)  
- Configurar Docker  
- Diseñar estructura de carpetas  
- Documentación inicial  
- Servidor Express básico  

**Entregable:** Proyecto ejecutable en Docker con servidor básico

---

### Semana 2 — Lógica del juego y modelo de objetos (POO)
**Objetivo:** Sistema base de entidades y comportamiento  
**Tareas:**
- Definir clases: `Unidad`, `Estructura`, `Recurso`, `Jugador`  
- Implementar relaciones entre objetos  
- Crear `GameEngine`  
- Simulación básica (tick del juego)  
- Crear/editar objetos mediante código del usuario  

**Entregable:** Motor lógico funcional desde Node

---

### Semana 3 — Interfaz web interactiva
**Objetivo:** Base visual en el navegador  
**Tareas:**
- Frontend con HTML, CSS, TypeScript  
- Canvas 2D para renderizar entidades  
- Sincronización con backend via REST y WebSocket  
- Consola/panel para código de usuario  

**Entregable:** Mundo visual básico con interacción

---

### Semana 4 — Programación del usuario y simulación avanzada
**Objetivo:** Control de objetos mediante código  
**Tareas:**
- Intérprete/sandbox de scripts  
- Permitir control de unidades mediante código  
- Integrar acciones con `GameEngine`  
- Validaciones y errores amigables  
- Persistencia temporal (memoria o JSON)  

**Entregable:** Usuario puede manipular entidades escribiendo código

---

### Semana 5 — Pulido visual y despliegue
**Objetivo:** Versión completa y presentable  
**Tareas:**
- Mejorar interfaz (colores, iconos, efectos)  
- Panel de control para reiniciar mundo o cargar scripts  
- Documentar API y estructura de clases  
- Integrar Docker Compose  
- Desplegar en Railway o AWS-EC2  
- Preparar presentación final  

**Entregable:** Versión funcional lista para mostrar
