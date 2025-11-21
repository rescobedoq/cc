# Estructura lógica del Backend

Usar el code en https://editor.plantuml.com/

```js
@startuml
title CodeColony - Modelo de Objetos Completo (Semana 2)

' --- Core ---
class GameEngine {
  - entities: Map<string, Entity>
  - tickCount: number
  - waveNumber: number
  + spawnUnit(type: string, owner: string, code: string): void
  + spawnMonster(): void
  + spawnResource(): void
  + getNearbyEntities(center: Point, radius: number): Entity[]
  + updateWorld(): void
}

' --- Base ---
abstract class Entity {
  - id: string
  - position: Point
  - health: number
  - radius: number
  - ownerId: string 
  + takeDamage(amount: number): void
  + isAlive(): boolean
}

' --- Ramas Principales ---
abstract class Unit {
  - speed: number
  + moveToward(p: Point): void
}

abstract class Structure {
  - constructionTime: number
}

' --- Implementaciones Activas (Unidades) ---
class Warrior extends Unit {
  - weaponDamage: number
  - attackRange: number
  - userScript: string
  + attack(target: Entity): void
  + executeUserCode(): void
}

class Harvester extends Unit {
  - capacity: number
  - currentLoad: number
  - userScript: string
  + gather(resource: Resource): void
  + deliver(colony: Colony): void
  + executeUserCode(): void
}

class Monster extends Unit {
  - damage: number
  - aggroRange: number
  + findTarget(): Entity
  + attack(target: Entity): void
  + runAI(): void
}

' --- Implementaciones Estáticas ---
class Tower extends Structure {
  - range: number
  - damage: number
  + attackNearestEnemy(): void
}

class Colony extends Structure {
  - energyStockpile: number
  + spawn(type: UnitType): void
  + receiveResources(amount: number): void
}

class Resource extends Entity {
  - amountRemaining: number
  - type: ResourceType
  + extract(amount: number): number
}

' --- Interfaces y Helpers ---
class Point {
  - x: number
  - y: number
  + distanceTo(p: Point): number
}

' Relaciones
Entity <|-- Unit
Entity <|-- Structure
Entity <|-- Resource

Unit <|-- Warrior
Unit <|-- Harvester
Unit <|-- Monster

Structure <|-- Tower
Structure <|-- Colony

GameEngine "1" *-- "many" Entity : gestiona
Harvester ..> Resource : recolecta
Warrior ..> Monster : combate
Monster ..> Colony : busca destruir

@enduml
```

