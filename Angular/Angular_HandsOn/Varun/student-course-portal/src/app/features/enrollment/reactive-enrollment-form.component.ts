import { Component, OnInit, inject } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { DirtyFormComponent } from '../../guards/unsaved-changes.guard';
import { EnrollmentRequest } from '../../models/enrollment.model';
import { EnrollmentService } from '../../services/enrollment.service';

export function noCourseCode(control: AbstractControl): ValidationErrors | null {
  return String(control.value ?? '').toUpperCase().startsWith('XX') ? { noCourseCode: true } : null;
}

export function simulateEmailCheck(control: AbstractControl): Promise<ValidationErrors | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(String(control.value ?? '').includes('test@') ? { emailTaken: true } : null);
    }, 800);
  });
}

@Component({
  selector: 'app-reactive-enrollment-form',
  imports: [ReactiveFormsModule],
  templateUrl: './reactive-enrollment-form.component.html',
  styleUrl: './reactive-enrollment-form.component.css'
})
export class ReactiveEnrollmentFormComponent implements OnInit, DirtyFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly enrollmentService = inject(EnrollmentService);

  enrollForm = this.fb.group({
    studentName: ['', [Validators.required, Validators.minLength(3)]],
    studentEmail: this.fb.control('', [Validators.required, Validators.email], [simulateEmailCheck]),
    courseId: ['', [Validators.required, noCourseCode]],
    preferredSemester: ['Odd', Validators.required],
    agreeToTerms: [false, Validators.requiredTrue],
    additionalCourses: this.fb.array<FormControl<string>>([])
  });

  submitted = false;

  ngOnInit(): void {}

  get additionalCourses(): FormArray<FormControl<string>> {
    // This getter keeps the template strongly typed instead of repeating casts in HTML.
    return this.enrollForm.get('additionalCourses') as FormArray<FormControl<string>>;
  }

  addCourse(): void {
    this.additionalCourses.push(this.fb.control('', { nonNullable: true, validators: Validators.required }));
  }

  removeCourse(index: number): void {
    this.additionalCourses.removeAt(index);
  }

  onSubmit(): void {
    console.log(this.enrollForm.value, this.enrollForm.getRawValue());
    // value excludes disabled controls; getRawValue includes every control in the form tree.
    if (this.enrollForm.invalid) {
      return;
    }

    const rawValue = this.enrollForm.getRawValue();
    const request: EnrollmentRequest = {
      studentName: rawValue.studentName ?? '',
      studentEmail: rawValue.studentEmail ?? '',
      courseId: rawValue.courseId ?? '',
      preferredSemester: rawValue.preferredSemester === 'Even' ? 'Even' : 'Odd',
      agreeToTerms: rawValue.agreeToTerms === true,
      additionalCourses: rawValue.additionalCourses
    };

    this.enrollmentService.submitEnrollment(request).subscribe({
      next: () => (this.submitted = true),
      error: () => {
        this.submitted = true;
        console.log('JSON Server is not running; reactive form logic was still validated locally.');
      }
    });
  }

  isDirty(): boolean {
    return this.enrollForm.dirty;
  }
}
