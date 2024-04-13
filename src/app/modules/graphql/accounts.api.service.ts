import { Injectable, Type } from '@angular/core';
import { inject } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { GetAllAccountsGQL, Gl_Trial_BalanceGQL, Gl_TypesGQL, Journal_DetailGQL, Journal_HeaderGQL } from './api.service';
import { map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AccountsApiService {

  // apollo = inject(Apollo);
  getAllAccountsGQL = inject(GetAllAccountsGQL);
  getJournalHeaderGQL = inject(Journal_HeaderGQL);
  getJournalDetailGQL = inject(Journal_DetailGQL);
  getAccountTypesGQL = inject(Gl_TypesGQL);
  getTrialBalanceGQL = inject(Gl_Trial_BalanceGQL);

  GetTrialBalance(): any {
    return this.getTrialBalanceGQL.watch().valueChanges.pipe(map((result) => result.data.gl_trial_balance));
  }

  GetAllTypes(): any {
    return this.getAccountTypesGQL.watch().valueChanges.pipe(map((result) => result.data.gl_types));
  }

  GetJournalHeaderById(id: string): any {
    // return this.apollo.query({
    //   query: this.getJournalHeaderGQL.document,
    //   variables: {
    //     id: id
    //   }
    // });
  }

  GetAllJournalHeaders(): any {
    return this.getJournalHeaderGQL.watch().valueChanges.pipe(map((result) => result.data.gl_journal_header));
  }

  GetJournalDetailById(id: string): any {
    // return this.apollo.query({
    //   query: this.getJournalDetailGQL.document,
    //   variables: {
    //     id: id
    //   }
    // });
  }

  GetAllAccounts(): any {
    return this.getAllAccountsGQL.watch().valueChanges.pipe(map((result) => result.data.gl_accounts));
  }

  GetAccountById(id: string): any {
    // return this.apollo.query({
    //   query: this.getAllAccountsGQL.document,
    //   variables: {
    //     id: id
    //   }
    // });
  }

  GetJournalEntriesByAccountId(id: string): any {
    // return this.apollo.query({
    //   query: this.getAllAccountsGQL.document,
    //   variables: {
    //     id: id
    //   }
    // });
  }


}
