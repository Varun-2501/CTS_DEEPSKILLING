import { NgClass, NgStyle, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Course } from '../../models/course.model';
import { CreditLabelPipe } from '../../pipes/credit-label.pipe';
import { EnrollmentService } from '../../services/enrollment.service';
import { enrollInCourse, unenrollFromCourse } from '../../store/enrollment/enrollment.actions';

@Component({
  selector: 'app-course-card',
  imports: [CreditLabelPipe, NgClass, NgStyle, NgSwitch, NgSwitchCase, NgSwitchDefault],
  templateUrl: './course-card.component.html',
  styleUrl: './course-card.component.css'
})
export class CourseCardComponent implements OnChanges {
  @Input({ required: true }) course!: Course;
  @Input() enrolledIds: number[] | null = [];
  @Output() enrollRequested = new EventEmitter<number>();
  @Output() cardSelected = new EventEmitter<number>();

  isExpanded = false;

  private readonly enrollmentService = inject(EnrollmentService);
  private readonly store = inject(Store);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['course']) {
      console.log('Course input changed', {
        previous: changes['course'].previousValue,
        current: changes['course'].currentValue
      });
    }
  }

  get isEnrolled(): boolean {
    return this.enrolledIds?.includes(this.course.id) || this.enrollmentService.isEnrolled(this.course.id);
  }

  get cardClasses(): Record<string, boolean> {
    // A getter keeps conditional class logic readable and keeps the template focused on markup.
    return {
      'card--enrolled': this.isEnrolled,
      'card--full': (this.course.credits ?? 0) >= 4,
      expanded: this.isExpanded
    };
  }

  get statusBorderColor(): string {
    return this.course.gradeStatus === 'passed' ? '#16a34a' : this.course.gradeStatus === 'failed' ? '#dc2626' : '#64748b';
  }

  toggleDetails(event: Event): void {
    event.stopPropagation();
    this.isExpanded = !this.isExpanded;
  }

  onEnrollClick(event: Event): void {
    event.stopPropagation();
    const wasEnrolled = this.isEnrolled;
    this.enrollmentService.toggle(this.course.id);
    this.store.dispatch(wasEnrolled ? unenrollFromCourse({ courseId: this.course.id }) : enrollInCourse({ courseId: this.course.id }));
    this.enrollRequested.emit(this.course.id);
  }
}
