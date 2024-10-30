import {
  DragDropManager as AbstractDragDropManager,
  DragDropManagerInput,
  type Plugins,
  type Sensors,
} from '@dnd-kit/abstract';
import {isElement} from '@dnd-kit/dom/utilities';

import type {Draggable, Droppable} from '../entities/index.ts';
import {
  Accessibility,
  AutoScroller,
  Cursor,
  Feedback,
  Scroller,
  ScrollListener,
  PreventSelection,
} from '../plugins/index.ts';
import {KeyboardSensor, PointerSensor} from '../sensors/index.ts';

export interface Input extends DragDropManagerInput<any> {}

export const defaultPreset: {
  plugins: Plugins<DragDropManager>;
  sensors: Sensors<DragDropManager>;
} = {
  plugins: [Accessibility, AutoScroller, Cursor, Feedback, PreventSelection],
  sensors: [
    PointerSensor.configure({
      activationConstraints(event, source) {
        const {pointerType, target} = event;

        if (
          pointerType === 'mouse' &&
          isElement(target) &&
          (source.handle === target || source.handle?.contains(target))
        ) {
          return undefined;
        }

        return {
          delay: {value: 200, tolerance: 10},
          distance: {value: 5},
        };
      },
    }),
    KeyboardSensor,
  ],
};

export class DragDropManager<
  T extends Draggable = Draggable,
  U extends Droppable = Droppable,
> extends AbstractDragDropManager<Draggable, Droppable> {
  constructor(input: Input = {}) {
    const {
      plugins = defaultPreset.plugins,
      sensors = defaultPreset.sensors,
      modifiers = [],
    } = input;

    // This is a hack to prevent the `getFrameElement` function from returning a frame above this window
    // We need to find a better way to handle this since there could be multiple instances of `DragDropManager`
    // in different execution contexts. A better way to solve this would be to store the excution context on the
    // manager instance, and then pass that manager instance to the `getFrameElement` function.
    (window as any)['dnd-kit'] = true;

    super({
      ...input,
      plugins: [ScrollListener, Scroller, ...plugins],
      sensors,
      modifiers,
    });
  }
}
