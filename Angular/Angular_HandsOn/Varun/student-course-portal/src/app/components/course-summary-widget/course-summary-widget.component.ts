import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-course-summary-widget',
  imports: [AsyncPipe],
  templateUrl: './course-summary-widget.component.html',
  styleUrl: './course-summary-widget.component.css'
})
export class CourseSummaryWidgetComponent {
  private readonly courseService = inject(CourseService);
  readonly courses$ = this.courseService.localCourses$;
}
