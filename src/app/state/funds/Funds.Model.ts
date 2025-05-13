import { IDropDown, IFunds } from  'app/models';

export interface FundsModel {
    funds: IFunds[];
    fundsDropDown: IDropDown[];
    activeFundId: number | null;
    selectedFund: IFunds | null;
    isLoading: boolean;
    error: string | null;
}

