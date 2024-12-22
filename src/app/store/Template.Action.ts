import { createAction, props } from "@ngrx/store";
import { IJournalTemplate } from "app/models/journals";

export const LOAD_TEMPLATES = 'templates getall';
export const LOAD_TEMPLATES_SUCCESS = 'templates getall success';
export const LOAD_TEMPLATES_FAILURE = 'templates getall failure'; 


export const loadTemplates = createAction(LOAD_TEMPLATES);
export const loadTemplatesSuccess = createAction(LOAD_TEMPLATES_SUCCESS, props<{ list: IJournalTemplate[] }>());
export const loadTemplatesFailure = createAction(LOAD_TEMPLATES_FAILURE, props<{ error: string }>());


export const TemplateActions = {
    loadTemplates
};



