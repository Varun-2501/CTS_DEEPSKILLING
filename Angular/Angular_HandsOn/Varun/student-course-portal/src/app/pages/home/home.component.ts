import { DecimalPipe } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CourseSummaryWidgetComponent } from '../../components/course-summary-widget/course-summary-widget.component';
import { NotificationComponent } from '../../components/notification/notification.component';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-home',
  imports: [CourseSummaryWidgetComponent, DecimalPipe, FormsModule, NotificationComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  portalName = 'Student Course Portal';
  isPortalActive = true;
  message = '';
  searchTerm = '';
  availableCourses = 12;
  enrolled = 3;
  gpa = 3.8;

  private readonly courseService = inject(CourseService);

  ngOnInit(): void {
    this.availableCourses = this.courseService.getLocalCourses().length;
    this.courseService.localCourses$.subscribe((courses) => (this.availableCourses = courses.length));
    console.log('HomeComponent initialised - courses loaded');
  }

  ngOnDestroy(): void {
    console.log('HomeComponent destroyed');
  }

  onEnrollClick(): void {
    this.message = 'Enrollment opened!';
  }

  addLocalCourse(): void {
    const nextId = this.courseService.getLocalCourses().length + 1;
    this.courseService.addCourse({
      id: nextId,
      name: `Shared Service Course ${nextId}`,
      code: `DI${nextId}`,
      credits: 2,
      gradeStatus: 'pending',
      description: 'Added locally to prove HomeComponent and CourseSummaryWidget share one CourseService instance.'
    });
  }
}
