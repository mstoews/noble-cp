import { createReducer, on } from '@ngrx/store';
import { templateState } from './Template.State';
import { loadTemplatesFailure, loadTemplatesSuccess } from './Template.Action';

const templateReducer = createReducer(  templateState,
    on(loadTemplatesSuccess, (state, action ) => {
        return {
            ...state,
            list: action.templates,
            error: null,
        }
    }),
    on(loadTemplatesFailure, (state, action ) => {
        return {
            ...state,
            list: [],
            error: action.error,
        }
    }
    )
 );


export function TemplateReducer(state: any, action: any) {
    return templateReducer(state, action);
}




