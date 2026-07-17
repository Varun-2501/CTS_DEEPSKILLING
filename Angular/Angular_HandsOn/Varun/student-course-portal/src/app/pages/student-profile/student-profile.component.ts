import { Component, inject } from '@angular/core';
import { EnrollmentService } from '../../services/enrollment.service';

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrl: './student-profile.component.css'
})
export class StudentProfileComponent {
  private readonly enrollmentService = inject(EnrollmentService);
  readonly enrolledCourses = this.enrollmentService.getEnrolledCourses();
}
