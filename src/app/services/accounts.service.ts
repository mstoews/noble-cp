import { Injectable, inject, signal } from '@angular/core';
import { Subject, catchError, exhaustMap, of, pipe, shareReplay, take, tap, throwError } from 'rxjs';
import { signalState, patchState } from '@ngrx/signals'
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';


import { HttpClient } from '@angular/common/http';
import { IDropDownAccounts } from '../models';
import { environment } from 'environments/environment.prod';
import { IAccounts } from 'app/models/journals';

type AccountState = { account: IAccounts[], isLoading: boolean }

const initialState: AccountState = {
    account: [],
    isLoading: false,
}


@Injectable({
    providedIn: 'root',
})
export class GLAccountsService {

    httpClient = inject(HttpClient)
    private baseUrl = environment.baseUrl;

    accountList = signal<IAccounts[]>([])
    private parentAccounts = signal<IAccounts[]>([])
    private dropDownList = signal<IDropDownAccounts[]>([])
    private childrenOfParents = signal<IAccounts[]>([])

    private accountState = signalState(initialState);

    // readonly accountList = this.accountState.account;
    readonly isLoading = this.accountState.isLoading;

    readUrl = this.baseUrl + '/v1/account_list';

    readonly read = rxMethod<void>(
        pipe(
            tap(() => patchState(this.accountState, { isLoading: true })),
            exhaustMap(() => {
                return this.httpClient.get<IAccounts[]>(this.readUrl).pipe(
                    tapResponse({
                        // next: (account) => patchState(this.accountState, { account }),
                        next: (account) => this.accountList.set(account),
                        error: console.error,
                        finalize: () => patchState(this.accountState, { isLoading: false }),
                    })
                );
            })
        )
    );

    // account and description only
    readDropDownChild() {
        var url = this.baseUrl + '/v1/read_child_accounts';
        if (this.dropDownList().length === 0) {
            this.httpClient.get<IDropDownAccounts[]>(url).pipe(
                tap(data => this.dropDownList.set(data)),
                take(1),
                catchError(err => {
                    const message = "Could not retrieve child accounts ...";
                    console.debug(message, err);
                    return throwError(() => new Error(`${JSON.stringify(err)}`));
                }),
                shareReplay()
            ).subscribe();
        }
        return this.dropDownList;
    }

    // only child account and no parents
    readChildren() {
        var url = this.baseUrl + '/v1/read_child_accounts';
        return this.httpClient.get<IDropDownAccounts[]>(url).pipe(
            tap(data => this.dropDownList.set(data)),
            take(1),
            catchError(err => {
                const message = "Could not retrieve chil accounts ...";
                console.debug(message, err);
                return throwError(() => new Error(`${JSON.stringify(err)}`));
            }),
            shareReplay()
        )
    }

    // only parent accounts
    getParents() {
        var url = this.baseUrl + '/v1/account_parent_list';
        if (this.parentAccounts().length === 0) {
            this.httpClient.get<IAccounts[]>(url).pipe(
                tap(data => this.parentAccounts.set(data)),
                take(1),
                catchError(err => {
                    const message = "Could not retrieve parent accounts ...";
                    console.debug(message, err);
                    return throwError(() => new Error(`${JSON.stringify(err)}`));
                }),
                shareReplay()
            ).subscribe();
        }
        return this.parentAccounts;
    }

    getChild(parent: string) {
        var url = this.baseUrl + '/v1/account_children_list/' + parent;

        if (this.childrenOfParents().length === 0) {
            this.httpClient.get<IAccounts[]>(url).pipe(
                tap(data => this.childrenOfParents.set(data)),
                take(1),
                catchError(err => {
                    const message = "Could not retrieve child account ...";
                    console.debug(message, err);
                    return throwError(() => new Error(`${JSON.stringify(err)}`));
                }),
                shareReplay()
            ).subscribe();
        }
        return this.childrenOfParents;
    }

    // Add
    create(accounts: Partial<IAccounts>) {

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
            update_user: accounts.update_user,
        }
        var url = this.baseUrl + '/v1/account_create';
        return this.httpClient.post(url, data)
            .pipe(
                shareReplay())
    }

    // Update
    update(accounts: Partial<IAccounts>) {

        var url = this.baseUrl + '/v1/account_update';

        var data: any = {
            account: Number(accounts.account),
            child: Number(accounts.child),
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
        return this.httpClient.post(url, data).pipe(
            tap(data => this.updateAccountList(data)),
            take(1),
            catchError(err => {
                const message = "Could not save journal header ...";
                console.debug(message, err);
                return throwError(() => new Error(`Invalid time ${err}`));
            }),
            shareReplay()
        )
            .subscribe();
    }

    // update account signal array
    updateAccountList(data: any) {
        this.accountList.update(items => items.map(account => account.account === data.account && account.child === data.child ? {
            account: data.account,
            child: data.child,
            parent_account: data.parent_account,
            type: data.type,
            sub_type: data.sub_type,
            balance: data.balance,
            description: data.description,
            comments: data.comments,
            status: data.status,
            create_date: data.create_date,
            create_user: data.create_user,
            update_date: data.update_date,
            update_user: data.update_user
        } : account));
    }


    // Delete
    delete(id: string) {
        var url = this.baseUrl + '/v1/account_delete';
        return this.httpClient.get<IAccounts[]>(url)
            .pipe(
                shareReplay())
    }
}
