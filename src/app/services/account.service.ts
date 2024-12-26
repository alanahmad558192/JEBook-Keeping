import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Account } from '../models/account';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private readonly STORAGE_KEY = 'accounts';
  private accounts = new BehaviorSubject<Account[]>([]);

  constructor() {
    this.loadAccounts();
  }

  private loadAccounts(): void {
    const storedAccounts = localStorage.getItem(this.STORAGE_KEY);
    if (storedAccounts) {
      this.accounts.next(JSON.parse(storedAccounts));
    }
  }

  private saveAccounts(accounts: Account[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(accounts));
    this.accounts.next(accounts);
  }

  getAccounts(): Observable<Account[]> {
    return this.accounts.asObservable();
  }

  getAccountById(id: string): Account | undefined {
    return this.accounts.value.find(account => account.id === id);
  }

  createAccount(account: Omit<Account, 'id'>): void {
    const newAccount = {
      ...account,
      id: Date.now().toString(),
      createdDate: new Date()
    };
    this.saveAccounts([...this.accounts.value, newAccount]);
  }

  updateAccount(id: string, account: Partial<Account>): void {
    const updatedAccounts = this.accounts.value.map(acc =>
      acc.id === id ? { ...acc, ...account } : acc
    );
    this.saveAccounts(updatedAccounts);
  }

  deleteAccount(id: string): void {
    const filteredAccounts = this.accounts.value.filter(acc => acc.id !== id);
    this.saveAccounts(filteredAccounts);
  }
}