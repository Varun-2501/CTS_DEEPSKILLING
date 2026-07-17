import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, map, of, switchMap } from 'rxjs';
import { Course } from '../models/course.model';
import { EnrollmentRequest } from '../models/enrollment.model';
import { Student } from '../models/student.model';
import { API_URL, CourseService } from './course.service';

@Injectable({ providedIn: 'root' })
export class EnrollmentService {
  private readonly courseService = inject(CourseService);
  private readonly http = inject(HttpClient);
  private readonly enrolledCourseIds = new BehaviorSubject<number[]>([]);

  readonly enrolledCourseIds$ = this.enrolledCourseIds.asObservable();

  enroll(courseId: number): void {
    if (!this.isEnrolled(courseId)) {
      this.enrolledCourseIds.next([...this.enrolledCourseIds.value, courseId]);
    }
  }

  unenroll(courseId: number): void {
    this.enrolledCourseIds.next(this.enrolledCourseIds.value.filter((id) => id !== courseId));
  }

  toggle(courseId: number): void {
    this.isEnrolled(courseId) ? this.unenroll(courseId) : this.enroll(courseId);
  }

  isEnrolled(courseId: number): boolean {
    return this.enrolledCourseIds.value.includes(courseId);
  }

  getEnrolledCourses(): Course[] {
    const enrolledIds = this.enrolledCourseIds.value;
    return this.courseService.getLocalCourses().filter((course) => enrolledIds.includes(course.id));
  }

  submitEnrollment(request: EnrollmentRequest): Observable<EnrollmentRequest> {
    return this.http.post<EnrollmentRequest>(`${API_URL}/enrollments`, request);
  }

  getStudentsByCourse(courseId: number): Observable<Student[]> {
    return of(courseId).pipe(
      // switchMap cancels the previous inner HTTP request when a newer selected course arrives.
      switchMap((id) => this.http.get<Student[]>(`${API_URL}/students?courseId=${id}`))
    );
  }

  getEnrolledCourses$(): Observable<Course[]> {
    return this.enrolledCourseIds$.pipe(
      map((ids) => this.courseService.getLocalCourses().filter((course) => ids.includes(course.id)))
    );
  }
}
