import {useEffect, useState} from 'react';
import type {DragDropManager} from '@dnd-kit/abstract';
import type {CleanupFunction} from '@dnd-kit/state';

import {useDragDropManager} from './useDragDropManager.ts';
import {defaultManager} from '../context/context.ts';

export interface Instance<
  T extends DragDropManager<any, any> = DragDropManager<any, any>,
> {
  manager: T | undefined;
  register(): CleanupFunction | void;
}

export function useInstance<T extends Instance>(
  initializer: (manager: DragDropManager<any, any> | undefined) => T
): T {
  const manager = useDragDropManager() ?? undefined;
  const [instance] = useState<T>(() => initializer(undefined));

  useEffect(() => {
    instance.manager = manager;
    const unregister = instance.register();
    return unregister;
  }, [instance, manager]);

  return instance;
}
