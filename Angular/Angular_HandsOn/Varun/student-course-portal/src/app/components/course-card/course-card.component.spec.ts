import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { provideMockStore } from '@ngrx/store/testing';
import { SimpleChange } from '@angular/core';
import { CourseCardComponent } from './course-card.component';
import { Course } from '../../models/course.model';

describe('CourseCardComponent', () => {
  let fixture: ComponentFixture<CourseCardComponent>;
  let component: CourseCardComponent;
  const mockCourse: Course = { id: 1, name: 'Data Structures', code: 'CS101', credits: 4, gradeStatus: 'passed' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseCardComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideMockStore({ initialState: { enrollment: { enrolledCourseIds: [] } } })
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CourseCardComponent);
    component = fixture.componentInstance;
    component.course = mockCourse;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render the input course name', () => {
    fixture.detectChanges();
    const heading = fixture.debugElement.query(By.css('h3')).nativeElement as HTMLElement;
    expect(heading.textContent).toContain('Data Structures');
  });

  it('should emit the course id when enroll is clicked', () => {
    spyOn(component.enrollRequested, 'emit');
    fixture.detectChanges();

    fixture.debugElement.query(By.css('.enroll-button')).nativeElement.click();

    expect(component.enrollRequested.emit).toHaveBeenCalledWith(1);
  });

  it('should log previous and current course input values in ngOnChanges', () => {
    spyOn(console, 'log');

    component.ngOnChanges({
      course: new SimpleChange(undefined, mockCourse, true)
    });

    expect(console.log).toHaveBeenCalled();
  });

  it('should transform credits with the credit label pipe', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('4 Credits');
  });
});
