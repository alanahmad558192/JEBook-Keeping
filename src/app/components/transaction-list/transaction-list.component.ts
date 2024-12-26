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
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css'],
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
