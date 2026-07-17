export type GradeStatus = 'passed' | 'failed' | 'pending';

export interface Course {
  id: number;
  name: string;
  code: string | null;
  credits: number | null;
  gradeStatus: GradeStatus;
  enrolled?: boolean;
  description?: string;
}
