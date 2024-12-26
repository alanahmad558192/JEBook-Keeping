import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { TransactionService } from '../../services/transaction.service';
import { AccountService } from '../../services/account.service';
import { Transaction } from '../../models/transaction';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="transaction-list">
      <div class="header">
        <h2>All Transactions</h2>
        <a routerLink="/transactions/new" class="btn-add">Add Transaction</a>
      </div>

      <div class="transactions-table">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Account</th>
              <th>Type</th>
              <th>Category</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (transaction of transactions; track transaction.id) {
              <tr>
                <td>{{ transaction.date | date:'mediumDate' }}</td>
                <td>{{ getAccountName(transaction.accountId) }}</td>
                <td>{{ transaction.type }}</td>
                <td>{{ transaction.category }}</td>
                <td>{{ transaction.description }}</td>
                <td [class.expense]="transaction.type === 'expense'"
                    [class.income]="transaction.type === 'income'">
                  {{ transaction.type === 'expense' ? '-' : '+' }}{{ transaction.amount | currency }}
                </td>
                <td class="actions">
                  <button (click)="editTransaction(transaction.id)">Edit</button>
                  <button (click)="deleteTransaction(transaction.id)">Delete</button>
                </td>
              </tr>
            }
            @empty {
              <tr>
                <td colspan="7" class="no-data">No transactions found</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .transaction-list {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .btn-add {
      padding: 0.5rem 1rem;
      background-color: #007bff;
      color: white;
      border-radius: 4px;
      text-decoration: none;
      transition: background-color 0.2s;

      &:hover {
        background-color: #0056b3;
      }
    }

    table {
      width: 100%;
      border-collapse: collapse;
      background-color: white;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    th, td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }

    th {
      background-color: #f8f9fa;
      font-weight: 600;
    }

    .expense { color: #dc3545; }
    .income { color: #28a745; }

    .actions {
      display: flex;
      gap: 0.5rem;

      button {
        padding: 0.25rem 0.5rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;

        &:first-child {
          background-color: #6c757d;
          color: white;
        }

        &:last-child {
          background-color: #dc3545;
          color: white;
        }
      }
    }

    .no-data {
      text-align: center;
      color: #6c757d;
      padding: 2rem;
    }
  `]
})
export class TransactionListComponent implements OnInit {
  transactions: Transaction[] = [];
  accountName: string = '';

  constructor(
    private transactionService: TransactionService,
    private accountService: AccountService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Get the accountId from query parameters
    this.route.queryParams.subscribe(params => {
      const accountId = params['accountId'];
      if (accountId) {
        // Get account name
        const account = this.accountService.getAccountById(accountId);
        this.accountName = account ? account.name : '';

        // Get transactions for specific account
        this.transactionService.getTransactionsByAccountId(accountId)
          .subscribe(transactions => {
            this.transactions = transactions;
          });
      } else {
        // If no accountId, show all transactions
        this.transactionService.getTransactions()
          .subscribe(transactions => {
            this.transactions = transactions;
          });
      }
    });
  }

  getAccountName(accountId: string): string {
    const account = this.accountService.getAccountById(accountId);
    return account ? account.name : 'Unknown Account';
  }

  editTransaction(id: string | undefined): void {
    if (id) {
      this.router.navigate(['/transactions/edit', id]);
    }
  }

  deleteTransaction(id: string | undefined): void {
    if (id && confirm('Are you sure you want to delete this transaction?')) {
      this.transactionService.deleteTransaction(id);

      // Refresh the transactions list based on whether we're viewing a specific account
      this.route.queryParams.subscribe((params) => {
        const accountId = params['accountId'];
        if (accountId) {
          this.transactionService
            .getTransactionsByAccountId(accountId)
            .subscribe((transactions) => {
              this.transactions = transactions;
            });
        } else {
          this.transactionService
            .getTransactions()
            .subscribe((transactions) => {
              this.transactions = transactions;
            });
        }
      });
    }
  }
}
