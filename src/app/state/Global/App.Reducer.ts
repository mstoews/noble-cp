import { createReducer, on } from "@ngrx/store";
import { GlobalState } from "./Global.state";
import { loadSpinner } from "./App.Action";

const _AppReducer = createReducer(GlobalState,

    on(loadSpinner, (state, action) => {
        return {
            ...state,
            IsLoaded: action.isLoaded
        }
    })


)

export function AppReducer(state: any, action: any) {
    return _AppReducer(state, action);

}