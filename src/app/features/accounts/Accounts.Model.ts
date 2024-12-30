import { IAccounts } from "app/models/journals";


export interface AccountState {
    accounts: IAccounts[];
    isLoading: boolean;
    status: 'pending' | 'success' | 'loading' | 'error';
    error: string | null;
    selectedAccount: number | null;
}
