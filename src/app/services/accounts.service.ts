import { Injectable, inject } from '@angular/core';
import { Observable, map, shareReplay } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { IAccounts, IDropDownAccounts } from '../models';
import { environment } from 'environments/environment.prod';

@Injectable({
    providedIn: 'root',
})
export class GLAccountsService {
    // imageItemIndexService: ImageItemIndexService = inject(ImageItemIndexService);

    httpClient = inject(HttpClient)
    private baseUrl = environment.baseUrl;

    //Query
    read() {
        var url = this.baseUrl + '/v1/account_list';
        return this.httpClient.get<IAccounts[]>(url)
            .pipe(
                shareReplay())
    }

    readDropDownChild() {
        var url = this.baseUrl + '/v1/read_child_accounts';
        return this.httpClient.get<IDropDownAccounts[]>(url)
            .pipe(
                shareReplay())
    }

    getParents(): Observable<IAccounts[]> {
        var url = this.baseUrl + '/v1/account_parent_list';
        return this.httpClient.get<IAccounts[]>(url)
            .pipe(
                shareReplay())
    }

    getChildren(parent: string) {        
        var url = this.baseUrl + '/v1/account_children_list/' + parent;
        
        return this.httpClient.get<IAccounts[]>(url)
            .pipe(
                shareReplay());
    }
    
    // Add
    create(accounts: Partial <IAccounts> ) {
        var data: IAccounts = {
            account: accounts.account,
            child: accounts.child,
            parent_account: accounts.parent_account,
            type: accounts.type,
            sub_type: accounts.sub_type,
            balance: 0.0,
            description: accounts.description, 
            comments: accounts.comments,
            status: accounts.status,
            create_date: accounts.create_date,
            create_user: accounts.create_user,
            update_date: accounts.update_date,
            update_user: accounts.update_user
        }
        var url = this.baseUrl + '/v1/account_create';
        return this.httpClient.post(url, data)
            .pipe(
                shareReplay())
    }

    // Update
    update(accounts: Partial <IAccounts>) {
        var url = this.baseUrl + '/v1/account_parent_list';
        return this.httpClient.get<IAccounts[]>(url)
            .pipe(
                shareReplay())
    }

    // Delete
    delete(id: string) {
        var url = this.baseUrl + '/v1/account_parent_list';
        return this.httpClient.get<IAccounts[]>(url)
            .pipe(
                shareReplay())
    }

}
