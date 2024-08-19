import type {DragOperation} from '../manager/index.ts';
import type {
  Draggable,
  Droppable,
  UniqueIdentifier,
} from '../entities/index.ts';
import {Serializable} from '../manager/dragOperation.ts';

export enum CollisionPriority {
  Lowest,
  Low,
  Normal,
  High,
  Highest,
}

export enum CollisionType {
  Collision,
  ShapeIntersection,
  PointerIntersection,
}

export interface Collision {
  id: UniqueIdentifier;
  priority: CollisionPriority | number;
  type: CollisionType;
  value: number;
  data?: Serializable;
}

export type Collisions = Collision[];

export interface CollisionDetectorInput<
  T extends Draggable = Draggable,
  U extends Droppable = Droppable,
> {
  droppable: U;
  dragOperation: DragOperation<T, U>;
}

export type CollisionDetector = <
  T extends Draggable = Draggable,
  U extends Droppable = Droppable,
>(
  input: CollisionDetectorInput<T, U>
) => Collision | null;
