export interface User {
  id?: number;
  email: string;
  password?: string;
  provider?: string;
  providerId?: string;
  name?: string;
  profilePictureUrl?: string;
  createdAt: string;
  updatedAt?: string;
  active?: boolean;
}
