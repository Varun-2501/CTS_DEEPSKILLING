import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, retry, tap, throwError } from 'rxjs';
import { Course } from '../models/course.model';

export const API_URL = 'http://localhost:3000';

const MOCK_COURSES: Course[] = [
  { id: 1, name: 'Angular Fundamentals', code: 'ANG101', credits: 3, gradeStatus: 'passed', enrolled: false, description: 'Components, templates, binding, and lifecycle basics.' },
  { id: 2, name: 'Reactive Forms', code: 'ANG205', credits: 4, gradeStatus: 'pending', enrolled: false, description: 'Complex forms using FormBuilder, validators, and FormArray.' },
  { id: 3, name: 'RxJS and HTTP', code: 'ANG310', credits: 3, gradeStatus: 'pending', enrolled: false, description: 'Observable streams, API integration, interceptors, and error handling.' },
  { id: 4, name: 'State Management with NgRx', code: 'ANG420', credits: 4, gradeStatus: 'failed', enrolled: false, description: 'Actions, reducers, effects, selectors, and store debugging.' },
  { id: 5, name: 'Testing Angular Apps', code: null, credits: 1, gradeStatus: 'passed', enrolled: false, description: 'Jasmine, Karma, TestBed, mocks, and coverage.' }
];

@Injectable({ providedIn: 'root' })
export class CourseService {
  private readonly http = inject(HttpClient);
  private readonly localCourses = [...MOCK_COURSES];
  private readonly localCoursesSubject = new BehaviorSubject<Course[]>(this.localCourses);

  readonly localCourses$ = this.localCoursesSubject.asObservable();

  getLocalCourses(): Course[] {
    return [...this.localCoursesSubject.value];
  }

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${API_URL}/courses`).pipe(
      map((courses) => courses.filter((course) => (course.credits ?? 0) > 0)),
      tap((courses) => console.log('Courses loaded:', courses.length)),
      retry(2),
      catchError((err) => {
        console.error(err);
        return throwError(() => new Error('Failed to load courses. Please try again.'));
      })
    );
  }

  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(`${API_URL}/courses/${id}`).pipe(
      retry(2),
      catchError((err) => {
        console.error(err);
        const fallback = this.localCourses.find((course) => course.id === id);
        if (fallback) {
          return new Observable<Course>((subscriber) => {
            subscriber.next(fallback);
            subscriber.complete();
          });
        }
        return throwError(() => new Error('Course not found.'));
      })
    );
  }

  addCourse(course: Course): void {
    this.localCoursesSubject.next([...this.localCoursesSubject.value, course]);
  }

  createCourse(course: Omit<Course, 'id'>): Observable<Course> {
    return this.http.post<Course>(`${API_URL}/courses`, course);
  }

  updateCourse(course: Course): Observable<Course> {
    return this.http.put<Course>(`${API_URL}/courses/${course.id}`, course);
  }

  deleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/courses/${id}`);
  }
}
