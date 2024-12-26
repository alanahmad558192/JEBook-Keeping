export interface Account {
  id?: string;
  name: string;
  balance: number;
  type: 'savings' | 'checking' | 'credit';
  description?: string;
  createdDate: Date;
}