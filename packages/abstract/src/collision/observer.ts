import {
  batch,
  computed,
  deepEqual,
  signal,
  untracked,
  type ReadonlySignal,
} from '@dnd-kit/state';

import type {DragDropManager} from '../manager';
import type {Draggable, Droppable} from '../nodes';
import {Plugin} from '../plugins';
import type {Collision, CollisionDetector, Collisions} from './types';
import {sortCollisions} from './utilities';

const DEFAULT_VALUE: Collisions = [];

export class CollisionObserver<
  T extends Draggable = Draggable,
  U extends Droppable = Droppable,
  V extends DragDropManager<T, U> = DragDropManager<T, U>,
> extends Plugin<V> {
  constructor(manager: V) {
    super(manager);

    this.computeCollisions = this.computeCollisions.bind(this);
    this.#collisions = computed(this.computeCollisions, deepEqual);
  }

  #forceUpdate = signal(0);

  public forceUpdate() {
    untracked(() => {
      const type = this.manager.dragOperation.source?.type;

      batch(() => {
        for (const droppable of this.manager.registry.droppables) {
          if (type != null && !droppable.accepts(type)) {
            continue;
          }

          droppable.refreshShape();
        }

        this.#forceUpdate.value++;
      });
    });
  }

  public computeCollisions(
    entries?: Droppable[],
    collisionDetector?: CollisionDetector
  ) {
    const {registry, dragOperation} = this.manager;
    const {source, shape, status} = dragOperation;

    if (!status.initialized || !shape) {
      return DEFAULT_VALUE;
    }

    const type = source?.type;
    const collisions: Collision[] = [];

    this.#forceUpdate.value;

    for (const entry of entries ?? registry.droppables) {
      if (entry.disabled || !entry.shape) {
        continue;
      }

      if (type != null && !entry.accepts(type)) {
        continue;
      }

      const detectCollision = collisionDetector ?? entry.collisionDetector;
      const collision = untracked(() =>
        detectCollision({
          droppable: entry,
          dragOperation,
        })
      );

      if (collision) {
        collisions.push(collision);
      }
    }

    collisions.sort(sortCollisions);

    return collisions;
  }

  public get collisions() {
    return this.#collisions.value;
  }

  #collisions: ReadonlySignal<Collisions>;
}
