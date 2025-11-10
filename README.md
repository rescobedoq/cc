

# CC

**Desarrollo de una Aplicación Web Interactiva Basada en Programación Orientada a Objetos para la Simulación de Colonias Inteligentes**

---

## Descripción General

**CodeColony** es una aplicación web interactiva inspirada en el concepto del juego *Screeps*, diseñada para enseñar y aplicar de forma avanzada los principios de la **Programación Orientada a Objetos (POO)** utilizando **TypeScript**.

El usuario puede crear y gestionar una **colonia virtual** cuyos elementos —unidades, estructuras, recursos, etc.— se controlan mediante código. Cada elemento del juego es un objeto programable con **relaciones, herencias y comportamientos definidos**.

El objetivo principal es ofrecer una experiencia **educativa y lúdica**, donde los jugadores apliquen conceptos de ingeniería de software en un entorno visual, interactivo y modular.

---
## Equipo

- Basurco Casani, Jeferson Joao  
- Betanzos Rosas, Taylor Anthony  
- Ccosco Alvis, Italo Frankdux  
- Pachari Quispe, Jorge Pachari  
- Huayhua Hillpa, Yourdyy Yossimar  

---

## Objetivos

### Objetivo General

Diseñar y desarrollar una aplicación web tipo simulador que permita a los usuarios programar el comportamiento de entidades dentro de un entorno virtual, aplicando conceptos avanzados de **POO en TypeScript**.

### Objetivos Específicos

* Implementar una arquitectura modular que refleje los principios de **herencia, polimorfismo, encapsulación y abstracción**.
* Simular **procesos concurrentes y tareas paralelas** utilizando *Web Workers* o un sistema interno de colas.
* Desarrollar una **interfaz visual propia** (basada en SVG o Canvas) para representar las colonias y sus unidades.
* Diseñar una **API interna** que comunique la lógica del juego (backend) con los scripts de los jugadores.
* Asegurar una base **escalable y extensible** para futuras expansiones o integración de IA.

---

## Justificación

**CodeColony** busca convertirse en una herramienta de aprendizaje experimental para la POO y la programación concurrente.
A diferencia de *Screeps*, se enfoca más en la **experimentación con patrones de diseño, estructuras de datos y técnicas avanzadas de programación**, en lugar de la competencia entre jugadores.

Todo el contenido —código, recursos gráficos y motor de simulación— será **original y libre de dependencias externas con derechos de autor**, lo que permite su uso académico o su posible registro como software educativo.

---

## Alcance

* Simulación de colonias con recursos, edificios y unidades programables.
* Motor de ejecución que interpreta **scripts seguros en TypeScript**.
* Interfaz visual minimalista en **SVG o Canvas**.
* Gestión del entorno y eventos (ataques, recolección, expansión, etc.).
* Persistencia de datos con **MongoDB** o **PostgreSQL**.
* Soporte de **multitarea simulada** mediante *Web Workers* o un sistema de tareas asíncronas.

---

## Estructura Técnica

### Frontend

* **Lenguaje:** TypeScript
* **Framework:** React o Vue.js
* **Gráficos:** SVG nativo, Canvas o PixiJS
* **Funcionalidades principales:**

  * Panel de control de la colonia
  * Consola de programación (editor con resaltado de sintaxis)
  * Mapa interactivo
  * Panel de eventos y notificaciones

### Backend

* **Entorno:** Node.js + TypeScript
* **Arquitectura:** API REST con lógica de simulación y control de entidades
* **Base de datos:** MongoDB o PostgreSQL
* **Características:**

  * Validación y ejecución segura del código del usuario
  * Gestión del estado del juego
  * Comunicación en tiempo real mediante WebSockets

---

## Innovación y Originalidad

**CodeColony** no replica ningún elemento de *Screeps*, sino que se **inspira en su concepto educativo** para crear un entorno completamente nuevo.

La innovación radica en:

* Un **motor de simulación orientado a objetos**, donde cada entidad implementa clases y patrones de diseño reales.
* Simulación de **procesos concurrentes** utilizando solo tecnologías web.
* Un **entorno visual propio y personalizable**, diseñado desde cero.

---

## Metodología de Desarrollo

* **Metodología:** Ágil (Scrum / Kanban)
* **Control de versiones:** Git / GitHub
* **Testing:** Jest y pruebas de integración
* **Documentación:** TypeDoc + diagramas UML

---

## Resultados Esperados

* Aplicación web funcional, responsive y educativa.
* Entorno visual atractivo y de fácil uso.
* Sistema extensible para futuras expansiones o integración con IA.
* Documentación técnica detallada de diseño, patrones y componentes.

---

## Tecnologías Clave

| Categoría            | Tecnologías                           |
| -------------------- | ------------------------------------- |
| Lenguaje             | TypeScript                            |
| Frontend             | React / Vue.js, SVG / Canvas / PixiJS |
| Backend              | Node.js, Express                      |
| Base de Datos        | MongoDB / PostgreSQL                  |
| Comunicación         | WebSockets                            |
| Testing              | Jest                                  |
| Control de versiones | Git / GitHub                          |

---

