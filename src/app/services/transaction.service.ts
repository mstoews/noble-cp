import { inject, Injectable } from '@angular/core';
import { GLAccountsService } from './accounts.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  glAccountService = inject(GLAccountsService);
  
  constructor() { }
}
