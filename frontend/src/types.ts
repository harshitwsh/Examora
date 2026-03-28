export type EventCategory = 'Exam' | 'Assignment' | 'Quiz' | 'Lecture' | 'Other';

export interface CourseEvent {
  id: string;
  title: string;
  date: Date;
  rawDate: string;
  category: EventCategory;
  description?: string;
}

export type ViewMode = 'list' | 'calendar' | 'timeline';
