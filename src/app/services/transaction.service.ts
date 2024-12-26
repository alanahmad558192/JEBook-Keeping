import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Transaction } from '../models/transaction';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private readonly STORAGE_KEY = 'transactions';
  private transactions = new BehaviorSubject<Transaction[]>([]);

  constructor(private accountService: AccountService) {
    this.loadTransactions();
  }

  private loadTransactions(): void {
    const storedTransactions = localStorage.getItem(this.STORAGE_KEY);
    if (storedTransactions) {
      this.transactions.next(JSON.parse(storedTransactions));
    }
  }

  private saveTransactions(transactions: Transaction[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(transactions));
    this.transactions.next(transactions);
  }

  getTransactions(): Observable<Transaction[]> {
    return this.transactions.asObservable();
  }

  getTransactionsByAccountId(accountId: string): Observable<Transaction[]> {
    return new BehaviorSubject(
      this.transactions.value.filter(trans => trans.accountId === accountId)
    ).asObservable();
  }

  getTransactionById(id: string): Transaction | undefined {
    return this.transactions.value.find(trans => trans.id === id);
  }

  createTransaction(transaction: Omit<Transaction, 'id'>): void {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
      date: new Date(transaction.date)
    };

    // Update account balance for new transaction
    const account = this.accountService.getAccountById(transaction.accountId);
    if (account) {
      const balanceChange = transaction.type === 'income'
        ? transaction.amount
        : -transaction.amount;

      this.accountService.updateAccount(account.id!, {
        balance: account.balance + balanceChange
      });
    }

    this.saveTransactions([...this.transactions.value, newTransaction]);
  }

  updateTransaction(id: string, updatedTransaction: Partial<Transaction>): void {
    const oldTransaction = this.getTransactionById(id);
    if (oldTransaction && oldTransaction.accountId) {
      // Reverse the old transaction's effect on balance
      const oldAccount = this.accountService.getAccountById(oldTransaction.accountId);
      if (oldAccount) {
        const oldBalanceChange = oldTransaction.type === 'income'
          ? -oldTransaction.amount
          : oldTransaction.amount;

        this.accountService.updateAccount(oldAccount.id!, {
          balance: oldAccount.balance + oldBalanceChange
        });
      }

      // Apply the new transaction's effect on balance
      if (updatedTransaction.amount || updatedTransaction.type) {
        const newAccount = this.accountService.getAccountById(
          updatedTransaction.accountId || oldTransaction.accountId
        );
        if (newAccount) {
          const newBalanceChange = (updatedTransaction.type || oldTransaction.type) === 'income'
            ? (updatedTransaction.amount || oldTransaction.amount)
            : -(updatedTransaction.amount || oldTransaction.amount);

          this.accountService.updateAccount(newAccount.id!, {
            balance: newAccount.balance + newBalanceChange
          });
        }
      }
    }

    const updatedTransactions = this.transactions.value.map(trans =>
      trans.id === id ? { ...trans, ...updatedTransaction } : trans
    );
    this.saveTransactions(updatedTransactions);
  }

  deleteTransaction(id: string): void {
    const transaction = this.getTransactionById(id);
    if (transaction && transaction.accountId) {
      // Reverse the transaction's effect on balance
      const account = this.accountService.getAccountById(transaction.accountId);
      if (account) {
        const balanceChange = transaction.type === 'income'
          ? -transaction.amount
          : transaction.amount;

        this.accountService.updateAccount(account.id!, {
          balance: account.balance + balanceChange
        });
      }
    }

    const filteredTransactions = this.transactions.value.filter(trans => trans.id !== id);
    this.saveTransactions(filteredTransactions);
  }

  clearTransactions(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.transactions.next([]);
  }
}