import { IDropDownAccounts } from "app/models";
import { IAccounts } from "app/models/journals";


export interface AccountState {
    accounts: IAccounts[];
    accountsDropdown: IDropDownAccounts[];
    isLoading: boolean;
    status: 'pending' | 'success' | 'loading' | 'error';
    error: string | null;
    selectedAccount: number | null;
}
