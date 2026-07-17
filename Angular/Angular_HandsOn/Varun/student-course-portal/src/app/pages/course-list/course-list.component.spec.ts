import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { provideRouter } from '@angular/router';
import { CourseListComponent } from './course-list.component';
import { Course } from '../../models/course.model';

describe('CourseListComponent', () => {
  let fixture: ComponentFixture<CourseListComponent>;
  let store: MockStore;
  const mockCourses: Course[] = [
    { id: 1, name: 'Angular', code: 'ANG101', credits: 3, gradeStatus: 'passed' },
    { id: 2, name: 'Testing', code: 'ANG500', credits: 1, gradeStatus: 'pending' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseListComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideMockStore({
          initialState: {
            course: { courses: mockCourses, loading: false, error: null },
            enrollment: { enrolledCourseIds: [] }
          }
        })
      ]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(CourseListComponent);
  });

  it('should render course cards from MockStore state', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Angular');
    expect(fixture.nativeElement.textContent).toContain('Testing');
  });

  it('should show loading indicator from MockStore state', () => {
    store.setState({
      course: { courses: [], loading: true, error: null },
      enrollment: { enrolledCourseIds: [] }
    });

    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Loading courses...');
  });
});
