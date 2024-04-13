import { Injectable, inject } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import { IAccounts } from '../models';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment.prod';

@Injectable({
    providedIn: 'root',
})
export class GLAccountsService {
    // imageItemIndexService: ImageItemIndexService = inject(ImageItemIndexService);

    httpClient = inject(HttpClient)
    private baseUrl = environment.baseUrl;

    //Query
    getAll() {
        var url = this.baseUrl + '/v1/account_list';
        return this.httpClient.get<IAccounts[]>(url)
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
        console.log(`getChildren : ${parent} `);
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
