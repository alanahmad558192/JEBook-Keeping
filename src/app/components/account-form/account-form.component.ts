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
  templateUrl: './account-form.component.html',
  styleUrls: ['./account-form.component.css'],
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
