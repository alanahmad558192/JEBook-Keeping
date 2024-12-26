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
  template: `
    <div class="dashboard">
      <section class="accounts-overview">
        <div class="section-header">
          <h2>Accounts Overview</h2>
          <a routerLink="/accounts/new" class="btn-add">Add Account</a>
        </div>

        <div class="accounts-grid">
          @for (account of accounts; track account.id) {
          <div class="account-card">
            <h3>{{ account.name }}</h3>
            <p class="balance" [class.negative]="account.balance < 0">
              {{ account.balance | currency }}
            </p>
            <p class="type">{{ account.type }}</p>
            <div class="card-actions">
              <a
                [routerLink]="['/transactions']"
                [queryParams]="{ accountId: account.id }"
                target="_blank"
                class="btn-view-transactions"
              >
                📊
              </a>
            </div>
          </div>
          } @empty {
          <p>No accounts found. Create your first account!</p>
          }
        </div>
      </section>

      <section class="recent-transactions">
        <div class="section-header">
          <h2>Recent Transactions</h2>
          <a routerLink="/transactions/new" class="btn-add">Add Transaction</a>
        </div>

        <div class="transactions-list">
          @for (transaction of recentTransactions; track transaction.id) {
          <div class="transaction-item">
            <div class="transaction-info">
              <span class="date">{{
                transaction.date | date : 'shortDate'
              }}</span>
              <span class="account">{{
                getAccountName(transaction.accountId)
              }}</span>
              <span class="description">{{ transaction.description }}</span>
            </div>
            <span
              class="amount"
              [class.expense]="transaction.type === 'expense'"
              [class.income]="transaction.type === 'income'"
            >
              {{ transaction.type === 'expense' ? '-' : '+'
              }}{{ transaction.amount | currency }}
            </span>
          </div>
          } @empty {
          <p>No transactions found. Add your first transaction!</p>
          }
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      .dashboard {
        padding: 20px;
        max-width: 1200px;
        margin: 0 auto;
      }

      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }

      .btn-add {
        padding: 8px 16px;
        background-color: #007bff;
        color: white;
        border-radius: 4px;
        text-decoration: none;
      }

      .accounts-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 20px;
        margin-bottom: 40px;
      }

      .account-card {
        cursor: pointer;
        transition: transform 0.2s ease;

        &:hover {
          transform: translateY(-2px);
        }

        padding: 20px;
        background-color: #f8f9fa;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .account-transactions {
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid #eee;
      }

      .transaction-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 0;
        font-size: 0.9em;

        .date {
          color: #6c757d;
        }

        .amount {
          &.expense {
            color: #dc3545;
          }
          &.income {
            color: #28a745;
          }
        }
      }

      .balance {
        font-size: 1.5em;
        font-weight: bold;
        &.negative {
          color: #dc3545;
        }
      }

      .type {
        color: #6c757d;
        text-transform: capitalize;
      }

      .transactions-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .transaction-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        background-color: #f8f9fa;
        border-radius: 4px;
      }

      .transaction-info {
        display: flex;
        gap: 10px;
        align-items: center;
      }

      .date {
        color: #6c757d;
      }

      .amount {
        font-weight: bold;
        &.expense {
          color: #dc3545;
        }
        &.income {
          color: #28a745;
        }
      }

      .account {
        color: #6c757d;
        font-size: 0.9em;
        margin-right: 10px;
        padding: 2px 6px;
        background-color: #f8f9fa;
        border-radius: 4px;
      }
    `,
  ],
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
