import { createAction, props } from "@ngrx/store";
import { IJournalTemplate, ITemplateParams } from "app/models/journals";

export const LOAD_TEMPLATES = 'templates getall';
export const LOAD_TEMPLATES_SUCCESS = 'templates getall success';
export const LOAD_TEMPLATES_FAILURE = 'templates getall failure'; 

export const CREATE_TEMPLATES = 'create template getall';
export const CREATE_TEMPLATES_SUCCESS = 'create  template success';
export const CREATE_TEMPLATES_FAILURE = 'create  template failure'; 


export const DELETE_TEMPLATES = 'account delete'
export const DELETE_TEMPLATES_SUCCESS = 'account delete success'

export const ADD_TEMPLATES = 'account add'
export const ADD_TEMPLATES_SUCCESS = 'account add success'

export const UPDATE_TEMPLATES = 'account update'
export const UPDATE_TEMPLATES_SUCCESS = 'account update success'

export const GET_TEMPLATES = 'account get account'

export const loadTemplates = createAction(LOAD_TEMPLATES);
export const loadTemplatesSuccess = createAction(LOAD_TEMPLATES_SUCCESS, props<{ list: IJournalTemplate[] }>());
export const loadTemplatesFailure = createAction(LOAD_TEMPLATES_FAILURE, props<{ error: string }>());


export const createTemplates        = createAction(CREATE_TEMPLATES, props<{ template: ITemplateParams }>());
export const createTemplatesSuccess = createAction(CREATE_TEMPLATES_SUCCESS, props<{ list: IJournalTemplate[] }>());
export const createTemplatesFailure = createAction(CREATE_TEMPLATES_FAILURE, props<{ error: string }>());


export const deleteTemplates = createAction(DELETE_TEMPLATES, props<{ id: number }>());
export const deleteTemplatesSuccess = createAction(DELETE_TEMPLATES_SUCCESS, props<{ id: number }>());

export const addTemplates = createAction(ADD_TEMPLATES, props<{ template: IJournalTemplate }>());
export const addTemplatesSuccess = createAction(ADD_TEMPLATES_SUCCESS, props<{ template: IJournalTemplate }>());

export const updateTemplates = createAction(UPDATE_TEMPLATES, props<{ template: IJournalTemplate }>());
export const updateTemplatesSuccess = createAction(UPDATE_TEMPLATES_SUCCESS, props<{ template: IJournalTemplate }>());

export const getTemplates = createAction(GET_TEMPLATES, props<{ id: number }>());
export const getTemplatesSuccess = createAction(UPDATE_TEMPLATES_SUCCESS, props<{ template: IJournalTemplate }>());
export const getTemplatesFailure = createAction(LOAD_TEMPLATES_FAILURE, props<{ error: string }>());

export const TemplateActions = {
    loadTemplates,
    loadTemplatesSuccess,
    loadTemplatesFailure,
    deleteTemplates,
    deleteTemplatesSuccess,
    addTemplates,
    addTemplatesSuccess,
    updateTemplates,
    updateTemplatesSuccess,
    getTemplates,
    getTemplatesSuccess,
    getTemplatesFailure
};



