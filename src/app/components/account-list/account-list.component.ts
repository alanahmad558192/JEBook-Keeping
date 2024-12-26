import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { Account } from '../../models/account';

@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="account-list">
      <div class="header">
        <h2>Accounts</h2>
        <a routerLink="/accounts/new" class="btn-add">Add Account</a>
      </div>

      <div class="accounts-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Balance</th>
              <th>Created Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (account of accounts; track account.id) {
              <tr>
                <td>{{ account.name }}</td>
                <td>{{ account.type }}</td>
                <td [class.negative]="account.balance < 0">
                  {{ account.balance | currency }}
                </td>
                <td>{{ account.createdDate | date:'mediumDate' }}</td>
                <td class="actions">
                  <a [routerLink]="['/accounts/edit', account.id]" class="btn-edit">Edit</a>
                  <!-- Add this new icon button -->
                  <a [routerLink]="['/transactions']" [queryParams]="{accountId: account.id}"
                     target="_blank" class="btn-view-transactions">
                    📊
                  </a>
                  <button class="btn-delete" (click)="deleteAccount(account.id!)">Delete</button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,

  styles: [`
    .account-list {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
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

    .accounts-table {
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      background-color: white;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }

    th {
      background-color: #f8f9fa;
      font-weight: 600;
    }

    .negative {
      color: #dc3545;
    }

    .actions {
      display: flex;
      gap: 8px;
    }

    .btn-edit {
      padding: 4px 8px;
      background-color: #6c757d;
      color: white;
      border-radius: 4px;
      text-decoration: none;
      font-size: 0.9em;
    }

    .btn-delete {
      padding: 4px 8px;
      background-color: #dc3545;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9em;
    }

    .no-data {
      text-align: center;
      color: #6c757d;
    }

    .btn-view-transactions {
      padding: 4px 8px;
      background-color: #28a745;
      color: white;
      border-radius: 4px;
      text-decoration: none;
      font-size: 1.2em;
      cursor: pointer;
      margin: 0 4px;

      &:hover {
        background-color: #218838;
      }
    }
  `]
})
export class AccountListComponent implements OnInit {
  accounts: Account[] = [];

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.accountService.getAccounts().subscribe(accounts => {
      this.accounts = accounts;
    });
  }

  deleteAccount(id: string): void {
    if (confirm('Are you sure you want to delete this account?')) {
      this.accountService.deleteAccount(id);
    }
  }
}
