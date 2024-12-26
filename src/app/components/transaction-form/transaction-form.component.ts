import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { TransactionService } from '../../services/transaction.service';
import { AccountService } from '../../services/account.service';
import { Transaction } from '../../models/transaction';
import { Account } from '../../models/account';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="transaction-form">
      <h2>{{ isEditing ? 'Edit' : 'Create' }} Transaction</h2>

      <form (ngSubmit)="onSubmit()" #transactionForm="ngForm">
        <div class="form-group">
          <label for="account">Account</label>
          <select
            id="account"
            name="accountId"
            [(ngModel)]="transaction.accountId"
            required>
            <option value="">Select an account</option>
            @for (account of accounts; track account.id) {
              <option [value]="account.id">{{ account.name }}</option>
            }
          </select>
        </div>

        <div class="form-group">
          <label for="type">Transaction Type</label>
          <select
            id="type"
            name="type"
            [(ngModel)]="transaction.type"
            required>
            <option value="income">Income (Debit)</option>
            <option value="expense">Expense (Credit)</option>
          </select>
        </div>

        <div class="form-group">
          <label for="date">Date</label>
          <input type="date" id="date" name="date" [(ngModel)]="transaction.date" required>
        </div>

        <div class="form-group">
          <label for="amount">Amount</label>
          <input type="number" id="amount" name="amount" [(ngModel)]="transaction.amount" required>
        </div>

        <div class="form-group">
          <label for="category">Category</label>
          <input type="text" id="category" name="category" [(ngModel)]="transaction.category" required>
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea id="description" name="description" [(ngModel)]="transaction.description"></textarea>
        </div>

        <div class="form-actions">
          <button type="button" class="btn-cancel" (click)="cancel()">Cancel</button>
          <button type="submit" class="btn-submit" [disabled]="!transactionForm.form.valid">
            {{ isEditing ? 'Update' : 'Create' }} Transaction
          </button>
        </div>
      </form>
    </div>
  `,
  // styles: [/* ... existing styles ... */]
  styles: [`
        .transaction-form {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        label {
          display: block;
          margin-bottom: 5px;
          font-weight: 500;
        }

        input, textarea {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1em;
        }

        .form-actions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          margin-top: 20px;
        }

        button {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1em;
        }

        .btn-cancel {
          background-color: #6c757d;
          color: white;
        }

        .btn-submit {
          background-color: #007bff;
          color: white;

          &:disabled {
            background-color: #ccc;
            cursor: not-allowed;
          }
        }
      `]
    })
export class TransactionFormComponent implements OnInit {
  transaction: Partial<Transaction> = {
    date: new Date(),
    amount: 0,
    type: 'income',
    category: '',
    description: ''
  };
  accounts: Account[] = [];
  isEditing = false;

  constructor(
    private transactionService: TransactionService,
    private accountService: AccountService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.accountService.getAccounts().subscribe(accounts => {
      this.accounts = accounts;
    });

    const transactionId = this.route.snapshot.paramMap.get('id');
    if (transactionId) {
      this.isEditing = true;
      const existingTransaction = this.transactionService.getTransactionById(transactionId);
      if (existingTransaction) {
        this.transaction = { ...existingTransaction };
      }
    }
  }

  onSubmit(): void {
    if (this.isEditing && this.transaction.id) {
      this.transactionService.updateTransaction(this.transaction.id, this.transaction);
    } else {
      this.transactionService.createTransaction(this.transaction as Omit<Transaction, 'id'>);
    }
    this.router.navigate(['/dashboard']);
  }

  cancel(): void {
    this.router.navigate(['/dashboard']);
  }
}
