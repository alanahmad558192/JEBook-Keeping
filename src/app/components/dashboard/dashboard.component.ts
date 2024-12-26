import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { TransactionService } from '../../services/transaction.service';
import { Account } from '../../models/account';
import { Transaction } from '../../models/transaction';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  styleUrls: ['./dashboard.component.css'],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  selectedAccountId: string | null = null;
  accountTransactions: Transaction[] = [];

  showAccountTransactions(accountId: string): void {
    // Toggle selected account
    if (this.selectedAccountId === accountId) {
      this.selectedAccountId = null;
      this.accountTransactions = [];
    } else {
      this.selectedAccountId = accountId;
      this.transactionService
        .getTransactionsByAccountId(accountId)
        .subscribe((transactions) => {
          this.accountTransactions = transactions;
        });
    }
  }

  getAccountName(accountId: string): string {
    const account = this.accountService.getAccountById(accountId);
    return account ? account.name : 'Unknown Account';
  }
  accounts: Account[] = [];
  recentTransactions: Transaction[] = [];

  constructor(
    private accountService: AccountService,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    // Subscribe to accounts
    this.accountService.getAccounts().subscribe((accounts) => {
      this.accounts = accounts;
    });

    // Subscribe to transactions and get only the 5 most recent
    this.transactionService.getTransactions().subscribe((transactions) => {
      this.recentTransactions = transactions
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);
    });
  }
}
