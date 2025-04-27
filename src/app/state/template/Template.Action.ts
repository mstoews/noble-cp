import { createAction, props } from "@ngrx/store";
import { IJournalDetailTemplate, IJournalTemplate, ITemplateParams } from "app/models/journals";

export const LOAD_TEMPLATES = 'templates getall';
export const LOAD_TEMPLATES_SUCCESS = 'templates getall success';
export const LOAD_TEMPLATES_FAILURE = 'templates getall failure'; 

export const CREATE_TEMPLATES = 'create template getall';
export const CREATE_TEMPLATES_SUCCESS = 'create  template success';
export const CREATE_TEMPLATES_FAILURE = 'create  template failure'; 

export const DELETE_TEMPLATES = 'template delete'
export const DELETE_TEMPLATES_SUCCESS = 'template delete success'
export const DELETE_TEMPLATES_FAILURE = 'delete template failure'; 

export const UPDATE_TEMPLATES = 'template update'
export const UPDATE_TEMPLATES_SUCCESS = 'template update success'
export const GET_TEMPLATES = 'template get'

export const LOAD_TEMPLATES_DETAILS = 'templates detail getall';
export const LOAD_TEMPLATES_DETAILS_SUCCESS = 'templates detail getall success';
export const LOAD_TEMPLATES_DETAILS_FAILURE = 'templates detail getall failure'; 

export const CREATE_TEMPLATES_DETAILS = 'create template detail getall';
export const CREATE_TEMPLATES_DETAILS_SUCCESS = 'create detail template success';
export const CREATE_TEMPLATES_DETAILS_FAILURE = 'create detail template failure'; 

export const DELETE_TEMPLATES_DETAILS = 'template detail delete'
export const DELETE_TEMPLATES_DETAILS_SUCCESS = 'template detail delete success'

export const UPDATE_TEMPLATES_DETAILS = 'template detail update'
export const UPDATE_TEMPLATES_DETAILS_SUCCESS = 'template detail update success'

export const loadTemplates = createAction(LOAD_TEMPLATES);
export const loadTemplatesSuccess = createAction(LOAD_TEMPLATES_SUCCESS, props<{ list: IJournalTemplate[] }>());
export const loadTemplatesFailure = createAction(LOAD_TEMPLATES_FAILURE, props<{ error: string }>());

export const createTemplates        = createAction(CREATE_TEMPLATES, props<{ template: IJournalTemplate }>());
export const createTemplatesSuccess = createAction(CREATE_TEMPLATES_SUCCESS, props<{ list: IJournalTemplate }>());
export const createTemplatesFailure = createAction(CREATE_TEMPLATES_FAILURE, props<{ error: string }>());

export const deleteTemplates = createAction(DELETE_TEMPLATES, props<{ id: number }>());
export const deleteTemplatesSuccess = createAction(DELETE_TEMPLATES_SUCCESS, props<{ id: number }>());

export const updateTemplates = createAction(UPDATE_TEMPLATES, props<{ template: IJournalTemplate }>());
export const updateTemplatesSuccess = createAction(UPDATE_TEMPLATES_SUCCESS, props<{ template: IJournalTemplate }>());

export const getTemplates = createAction(GET_TEMPLATES, props<{ id: number }>());
export const getTemplatesSuccess = createAction(UPDATE_TEMPLATES_SUCCESS, props<{ template: IJournalTemplate }>());
export const getTemplatesFailure = createAction(LOAD_TEMPLATES_FAILURE, props<{ error: string }>());

export const loadTemplatesDetails = createAction(LOAD_TEMPLATES_DETAILS, props<{ ref: string }>());
export const loadTemplatesDetailsSuccess = createAction(LOAD_TEMPLATES_DETAILS_SUCCESS, props<{ detail: IJournalDetailTemplate[] }>());
export const loadTemplatesDetailsFailure = createAction(LOAD_TEMPLATES_DETAILS_FAILURE, props<{ error: string }>());

export const createTemplatesDetails = createAction(CREATE_TEMPLATES_DETAILS, props<{ template: ITemplateParams }>());
export const createTemplatesDetailsSuccess = createAction(CREATE_TEMPLATES_DETAILS_SUCCESS, props<{ detail: IJournalDetailTemplate[] }>());
export const createTemplatesDetailsFailure = createAction(CREATE_TEMPLATES_DETAILS_FAILURE, props<{ error: string }>());

export const deleteTemplatesDetails = createAction(DELETE_TEMPLATES_DETAILS, props<{ id: number }>());
export const deleteTemplatesDetailsSuccess = createAction(DELETE_TEMPLATES_DETAILS_SUCCESS, props<{ id: number }>());

export const updateTemplatesDetails = createAction(UPDATE_TEMPLATES_DETAILS, props<{ template: IJournalTemplate }>());
export const updateTemplatesDetailsSuccess = createAction(UPDATE_TEMPLATES_DETAILS_SUCCESS, props<{ template: IJournalDetailTemplate }>());

export const emptyAction = createAction('Empty Action');


export const TemplateActions = {
    loadTemplates,
    loadTemplatesSuccess,
    loadTemplatesFailure,
    deleteTemplates,
    deleteTemplatesSuccess,
    updateTemplates,
    updateTemplatesSuccess,
    getTemplates,
    getTemplatesSuccess,
    getTemplatesFailure,
    loadTemplatesDetails,
    loadTemplatesDetailsSuccess,
    loadTemplatesDetailsFailure,
    deleteTemplatesDetails,
    deleteTemplatesDetailsSuccess,
    updateTemplatesDetails,
    updateTemplatesDetailsSuccess,
    createTemplates,
    createTemplatesSuccess,
    createTemplatesFailure,
    createTemplatesDetails,
    createTemplatesDetailsSuccess,
    createTemplatesDetailsFailure
};



