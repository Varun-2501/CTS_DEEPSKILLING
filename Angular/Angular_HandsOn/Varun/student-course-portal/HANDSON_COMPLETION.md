# Angular Hands-On Completion

Project: Student Course Portal

## Question-Wise Work

1. Hands-On 1: Created Angular 20 standalone project, notes.txt, header, home, course list, and profile pages.
2. Hands-On 2: Added interpolation, property binding, event binding, ngModel two-way binding, lifecycle hooks, @Input, @Output, and CourseCardComponent.
3. Hands-On 3: Added structural control flow, trackBy, ngClass, ngStyle, configurable highlight directive, and creditLabel pipe.
4. Hands-On 4: Added template-driven enrollment form with validators, error messages, reset, and submit handling.
5. Hands-On 5: Added reactive enrollment form with FormBuilder, custom sync validator, async validator, FormArray, and unsaved changes guard.
6. Hands-On 6: Added CourseService, EnrollmentService, AuthService, LoadingService, NotificationService, singleton DI usage, service-to-service injection, component-level provider, and a visible shared-service add-course demo.
7. Hands-On 7: Added nested routing for courses, course detail route, lazy-loaded enrollment routes, auth guard, and 404 route.
8. Hands-On 8: Added HttpClient CRUD methods, UI buttons for POST/PUT/DELETE verification, RxJS map/tap/retry/catchError/switchMap, auth/error/loading interceptors, global spinner, and db.json mock API.
9. Hands-On 9: Added NgRx actions, reducers, effects, selectors, course state, enrollment state, and Store DevTools setup.
10. Hands-On 10: Added focused unit specs for CourseCardComponent, CourseService, and CourseListComponent with MockStore.

## Run Commands

```powershell
npm install
npx json-server --watch db.json --port 3000
npm run api
npm start
npm run build
npm test -- --watch=false --browsers=ChromeHeadless
```

Use either `npx json-server --watch db.json --port 3000` or `npm run api` for the mock API.
