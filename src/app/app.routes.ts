import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AccountListComponent } from './components/account-list/account-list.component';
import { AccountFormComponent } from './components/account-form/account-form.component';
import { TransactionListComponent } from './components/transaction-list/transaction-list.component';
import { TransactionFormComponent } from './components/transaction-form/transaction-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'accounts', component: AccountListComponent },
  { path: 'accounts/new', component: AccountFormComponent },
  { path: 'accounts/edit/:id', component: AccountFormComponent },
  { path: 'transactions', component: TransactionListComponent },
  { path: 'transactions/new', component: TransactionFormComponent },
  { path: 'transactions/edit/:id', component: TransactionFormComponent },
];
