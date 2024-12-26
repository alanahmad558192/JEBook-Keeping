import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { Account } from '../../models/account';

@Component({
  selector: 'app-account-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="account-form">
      <h2>{{ isEditing ? 'Edit' : 'Create' }} Account</h2>

      <form (ngSubmit)="onSubmit()" #accountForm="ngForm">
        <div class="form-group">
          <label for="name">Account Name</label>
          <input
            type="text"
            id="name"
            name="name"
            [(ngModel)]="account.name"
            required
            #name="ngModel">
          <div *ngIf="name.invalid && (name.dirty || name.touched)" class="error">
            Account name is required
          </div>
        </div>

        <div class="form-group">
          <label for="type">Account Type</label>
          <select
            id="type"
            name="type"
            [(ngModel)]="account.type"
            required
            #type="ngModel">
            <option value="savings">Savings</option>
            <option value="checking">Checking</option>
            <option value="credit">Credit</option>
          </select>
          <div *ngIf="type.invalid && (type.dirty || type.touched)" class="error">
            Account type is required
          </div>
        </div>

        <div class="form-group">
          <label for="balance">Initial Balance</label>
          <input
            type="number"
            id="balance"
            name="balance"
            [(ngModel)]="account.balance"
            required
            #balance="ngModel">
          <div *ngIf="balance.invalid && (balance.dirty || balance.touched)" class="error">
            Initial balance is required
          </div>
        </div>

        <div class="form-group">
          <label for="description">Description (Optional)</label>
          <textarea
            id="description"
            name="description"
            [(ngModel)]="account.description"
            rows="3">
          </textarea>
        </div>

        <div class="form-actions">
          <button type="button" class="btn-cancel" (click)="cancel()">Cancel</button>
          <button type="submit" class="btn-submit" [disabled]="!accountForm.form.valid">
            {{ isEditing ? 'Update' : 'Create' }} Account
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .account-form {
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

    input, select, textarea {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1em;
    }

    .error {
      color: #dc3545;
      font-size: 0.9em;
      margin-top: 5px;
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
export class AccountFormComponent implements OnInit {
  account: Partial<Account> = {
    name: '',
    type: 'savings',
    balance: 0,
    description: ''
  };
  isEditing = false;

  constructor(
    private accountService: AccountService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const accountId = this.route.snapshot.paramMap.get('id');
    if (accountId) {
      this.isEditing = true;
      const existingAccount = this.accountService.getAccountById(accountId);
      if (existingAccount) {
        this.account = { ...existingAccount };
      }
    }
  }

  onSubmit(): void {
    if (this.isEditing && this.account.id) {
      this.accountService.updateAccount(this.account.id, this.account);
    } else {
      this.accountService.createAccount(this.account as Omit<Account, 'id'>);
    }
    this.router.navigate(['/accounts']);
  }

  cancel(): void {
    this.router.navigate(['/accounts']);
  }
}
