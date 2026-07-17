import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { CoursesLayoutComponent } from './pages/courses-layout/courses-layout.component';
import { CourseDetailComponent } from './pages/course-detail/course-detail.component';
import { CourseListComponent } from './pages/course-list/course-list.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { StudentProfileComponent } from './pages/student-profile/student-profile.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Student Course Portal' },
  {
    path: 'courses',
    component: CoursesLayoutComponent,
    children: [
      { path: '', component: CourseListComponent, title: 'Courses' },
      { path: ':id', component: CourseDetailComponent, title: 'Course Detail' }
    ]
  },
  {
    path: 'enroll',
    canActivate: [authGuard],
    loadChildren: () => import('./features/enrollment/enrollment.routes').then((m) => m.ENROLLMENT_ROUTES)
  },
  { path: 'profile', canActivate: [authGuard], component: StudentProfileComponent, title: 'Profile' },
  { path: '**', component: NotFoundComponent, title: 'Not Found' }
];
