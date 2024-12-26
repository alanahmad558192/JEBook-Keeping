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
  styleUrls: ['./transaction-form.component.css'],
  templateUrl: './transaction-form.component.html',
})
export class TransactionFormComponent implements OnInit {
  transaction: Partial<Transaction> = {
    date: new Date(),
    amount: 0,
    type: 'income',
    category: '',
    description: '',
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
    this.accountService.getAccounts().subscribe((accounts) => {
      this.accounts = accounts;
    });

    const transactionId = this.route.snapshot.paramMap.get('id');
    if (transactionId) {
      this.isEditing = true;
      const existingTransaction =
        this.transactionService.getTransactionById(transactionId);
      if (existingTransaction) {
        this.transaction = { ...existingTransaction };
      }
    }
  }

  onSubmit(): void {
    if (this.isEditing && this.transaction.id) {
      this.transactionService.updateTransaction(
        this.transaction.id,
        this.transaction
      );
    } else {
      this.transactionService.createTransaction(
        this.transaction as Omit<Transaction, 'id'>
      );
    }
    this.router.navigate(['/dashboard']);
  }

  cancel(): void {
    this.router.navigate(['/dashboard']);
  }
}
