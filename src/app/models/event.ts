import { Category } from './category';

export interface Event {
  id?: number;
  type: string;
  title: string;
  description: string;
  date: string;
  image?: string;
  category?: Category;
} 