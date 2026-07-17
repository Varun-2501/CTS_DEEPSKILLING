import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CourseService } from './course.service';
import { Course } from '../models/course.model';

describe('CourseService', () => {
  let service: CourseService;
  let httpMock: HttpTestingController;
  const mockCourses: Course[] = [
    { id: 1, name: 'Angular', code: 'ANG101', credits: 3, gradeStatus: 'passed' },
    { id: 2, name: 'Testing', code: 'ANG500', credits: 1, gradeStatus: 'pending' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CourseService, provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(CourseService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should get courses from the expected URL', (done) => {
    service.getCourses().subscribe((courses) => {
      expect(courses.length).toBe(2);
      done();
    });

    const req = httpMock.expectOne('http://localhost:3000/courses');
    expect(req.request.method).toBe('GET');
    req.flush(mockCourses);
  });

  it('should return a friendly error when getCourses fails', (done) => {
    service.getCourses().subscribe({
      error: (error) => {
        expect(error.message).toBe('Failed to load courses. Please try again.');
        done();
      }
    });

    for (let attempt = 0; attempt < 3; attempt++) {
      httpMock.expectOne('http://localhost:3000/courses').flush('Server error', {
        status: 500,
        statusText: 'Server Error'
      });
    }
  });
});
