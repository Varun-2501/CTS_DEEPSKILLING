import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { EnrollmentService } from '../../services/enrollment.service';

@Component({
  selector: 'app-enrollment-form',
  imports: [FormsModule],
  templateUrl: './enrollment-form.component.html',
  styleUrl: './enrollment-form.component.css'
})
export class EnrollmentFormComponent {
  model = {
    studentName: '',
    studentEmail: '',
    courseId: '',
    preferredSemester: 'Odd',
    agreeToTerms: false
  };
  submitted = false;

  private readonly enrollmentService = inject(EnrollmentService);

  onSubmit(form: NgForm): void {
    console.log(form.value, form.valid);
    if (form.invalid) {
      return;
    }

    this.enrollmentService.submitEnrollment(form.value).subscribe({
      next: () => (this.submitted = true),
      error: () => {
        this.submitted = true;
        console.log('JSON Server is not running; template form logic was still validated locally.');
      }
    });
  }
}
