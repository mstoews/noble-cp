import { AccountState } from './Accounts.Model';

export const initialState : AccountState = {
    accounts: [],
    isLoading: false,
    status: 'pending',
    error: null,
    selectedAccount: null,
};


