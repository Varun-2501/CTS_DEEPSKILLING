import { Routes } from '@angular/router';
import { unsavedChangesGuard } from '../../guards/unsaved-changes.guard';
import { EnrollmentFormComponent } from './enrollment-form.component';
import { ReactiveEnrollmentFormComponent } from './reactive-enrollment-form.component';

export const ENROLLMENT_ROUTES: Routes = [
  { path: '', component: EnrollmentFormComponent, title: 'Template Enrollment' },
  { path: 'reactive', canDeactivate: [unsavedChangesGuard], component: ReactiveEnrollmentFormComponent, title: 'Reactive Enrollment' }
];
