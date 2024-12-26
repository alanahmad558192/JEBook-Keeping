export interface Transaction {
  id?: string;
  accountId: string;
  amount: number;
  type: 'expense' | 'income';
  category: string;
  description?: string;
  date: Date;
}
