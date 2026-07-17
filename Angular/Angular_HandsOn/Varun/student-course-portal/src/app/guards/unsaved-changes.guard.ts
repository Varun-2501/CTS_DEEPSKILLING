import { CanDeactivateFn } from '@angular/router';

export interface DirtyFormComponent {
  isDirty(): boolean;
}

export const unsavedChangesGuard: CanDeactivateFn<DirtyFormComponent> = (component) => {
  if (!component.isDirty()) {
    return true;
  }

  return window.confirm('You have unsaved changes. Leave?');
};
