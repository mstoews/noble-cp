import { inject, Injectable } from '@angular/core';
import { AccountsService } from './accounts.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  glAccountService = inject(AccountsService);

  constructor() { }
}
