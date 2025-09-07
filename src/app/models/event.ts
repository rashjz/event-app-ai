import { Category } from './category';
import { EventType } from './event-type';

export interface Event {
  id?: number;
  eventType?: EventType;
  title: string;
  description: string;
  date: string;
  image?: string;
  category?: Category;
}
