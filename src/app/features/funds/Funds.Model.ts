import { IFunds } from  'app/models';

export interface FundsModel {
    list: IFunds[];
    isLoading: boolean;
    error: string | null;
}

