import { IDropDownAccounts } from "app/models";
import { IUser } from "app/models/user";


export interface UserState {
    user: IUser[];    
    isLoading: boolean;
    status: 'pending' | 'success' | 'loading' | 'error';
    error: string | null;
    selectedUser: string | null;
}
