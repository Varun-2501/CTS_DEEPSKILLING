import { AsyncPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CourseCardComponent } from '../../components/course-card/course-card.component';
import { HighlightDirective } from '../../directives/highlight.directive';
import { Course } from '../../models/course.model';
import { CourseService } from '../../services/course.service';
import { EnrollmentService } from '../../services/enrollment.service';
import { loadCourses } from '../../store/course/course.actions';
import { selectAllCourses, selectCoursesError, selectCoursesLoading } from '../../store/course/course.selectors';
import { selectEnrolledIds } from '../../store/enrollment/enrollment.selectors';

@Component({
  selector: 'app-course-list',
  imports: [AsyncPipe, CourseCardComponent, FormsModule, HighlightDirective],
  templateUrl: './course-list.component.html',
  styleUrl: './course-list.component.css'
})
export class CourseListComponent implements OnInit {
  selectedCourseId?: number;
  searchTerm = '';

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly courseService = inject(CourseService);
  private readonly enrollmentService = inject(EnrollmentService);
  private readonly store = inject(Store);

  readonly courses$: Observable<Course[]> = this.store.select(selectAllCourses);
  readonly isLoading$ = this.store.select(selectCoursesLoading);
  readonly errorMessage$ = this.store.select(selectCoursesError);
  readonly enrolledIds$ = this.store.select(selectEnrolledIds);

  ngOnInit(): void {
    this.searchTerm = this.route.snapshot.queryParamMap.get('search') ?? '';
    this.store.dispatch(loadCourses());
  }

  trackByCourseId(index: number, course: Course): number {
    // trackBy lets Angular reuse DOM nodes when unchanged courses keep the same id.
    return course.id;
  }

  onEnroll(courseId: number): void {
    console.log('Enrolling in course: ' + courseId);
    this.selectedCourseId = courseId;
    this.enrollmentService.getStudentsByCourse(courseId).subscribe({
      next: (students) => console.log('Students loaded for selected course:', students.length),
      error: () => console.log('Student lookup requires JSON Server to be running.')
    });
  }

  openCourse(courseId: number): void {
    this.router.navigate(['/courses', courseId]);
  }

  updateSearch(): void {
    this.router.navigate(['/courses'], {
      queryParams: this.searchTerm ? { search: this.searchTerm } : {}
    });
  }

  createApiCourse(): void {
    this.courseService
      .createCourse({
        name: 'API Created Course',
        code: 'API201',
        credits: 2,
        gradeStatus: 'pending',
        enrolled: false,
        description: 'Created from CourseService.createCourse to prove POST integration.'
      })
      .subscribe({ complete: () => this.store.dispatch(loadCourses()) });
  }

  updateApiCourse(): void {
    this.courseService
      .updateCourse({
        id: 1,
        name: 'Angular Fundamentals Updated',
        code: 'ANG101',
        credits: 3,
        gradeStatus: 'passed',
        enrolled: false,
        description: 'Updated from CourseService.updateCourse to prove PUT integration.'
      })
      .subscribe({ complete: () => this.store.dispatch(loadCourses()) });
  }

  deleteApiCourse(): void {
    this.courseService.deleteCourse(5).subscribe({ complete: () => this.store.dispatch(loadCourses()) });
  }
}
