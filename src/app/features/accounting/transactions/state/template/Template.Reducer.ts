import { createReducer, on } from '@ngrx/store';
import { templateState } from './Template.State';
import { loadTemplatesDetailsFailure, loadTemplatesDetailsSuccess, loadTemplatesFailure, loadTemplatesSuccess } from './Template.Action';

const templateReducer = createReducer(  templateState,
    on(loadTemplatesSuccess, (state, action ) => {
        return {
            ...state,
            list: action.list,
            error: null,
        }
    }),
    on(loadTemplatesFailure, (state, action ) => {
        return {
            ...state,
            list: [],
            error: action.error,
        }
    }),
    on(loadTemplatesDetailsSuccess, (state, action ) => {
        return {
            ...state,
            detail: action.detail,
            error: null,
        }
    }),
    on(loadTemplatesDetailsFailure, (state, action ) => {
        return {
            ...state,
            detail: [],
            error: null,
        }
    }),

 );


export function TemplateReducer(state: any, action: any) {
    return templateReducer(state, action);
}




