import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AppStateModel } from "./AppState.Model";

const getAppState=createFeatureSelector<AppStateModel>('app');

export const getSpinnerState=createSelector(getAppState,(state)=>{
    return state.IsLoaded;
});