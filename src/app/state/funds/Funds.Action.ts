import { createAction, props } from "@ngrx/store";
import { IFunds } from "app/models";

export const LOAD_FUNDS = '[funds] getall';
export const LOAD_FUNDS_SUCCESS = '[funds] getall success';
export const LOAD_FUNDS_FAILURE = '[funds] getall failure'; 

export const DELETE_FUNDS = '[funds] delete'
export const DELETE_FUNDS_SUCCESS = '[funds] delete success'

export const ADD_FUNDS = '[funds] add'
export const ADD_FUNDS_SUCCESS = '[funds] add success'

export const UPDATE_FUNDS = '[funds] update'
export const UPDATE_FUNDS_SUCCESS = '[funds] update success'

export const GET_FUNDS = '[funds] get'

export const loadFunds = createAction(LOAD_FUNDS);
export const loadFundsSuccess = createAction(LOAD_FUNDS_SUCCESS, props<{ funds: IFunds[] }>());
export const loadFundsFailure = createAction(LOAD_FUNDS_FAILURE, props<{ error: string }>());

export const deleteFunds = createAction(DELETE_FUNDS, props<{ id: string }>());
export const deleteFundsSuccess = createAction(DELETE_FUNDS_SUCCESS, props<{ id: string }>());

export const addFunds = createAction(ADD_FUNDS, props<{ funds: IFunds }>());
export const addFundsSuccess = createAction(ADD_FUNDS_SUCCESS, props<{ funds: IFunds }>());

export const updateFunds = createAction(UPDATE_FUNDS, props<{ funds: IFunds }>());
export const updateFundsSuccess = createAction(UPDATE_FUNDS_SUCCESS, props<{ funds: IFunds }>());

export const getFundsById = createAction(GET_FUNDS, props<{ id: number }>());
export const getFundsSuccess = createAction(UPDATE_FUNDS_SUCCESS, props<{ funds: IFunds }>());
export const getFundsFailure = createAction(LOAD_FUNDS_FAILURE, props<{ error: string }>());

export const FundsActions = {
    loadFunds,
    loadFundsSuccess,
    loadFundsFailure,
    deleteFunds,
    deleteFundsSuccess,
    addFunds,
    addFundsSuccess,
    updateFunds,
    updateFundsSuccess,
    getFundsById,
    getFundsSuccess,
    getFundsFailure
};



