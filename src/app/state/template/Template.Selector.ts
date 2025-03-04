import { createFeatureSelector, createSelector } from "@ngrx/store";
import { TemplateModel } from "./Template.Model";

const getTemplateState = createFeatureSelector<TemplateModel>('tpl');

export const getTemplates = createSelector(
    getTemplateState, (state) => { 
        return state.list
    }
);

export const getDetailTemplates = createSelector(
    getTemplateState, (state) => { 
        return state.detail
    }
);

export const getTemplateError = createSelector(
    getTemplateState, (state) => {
        return state.error
    }
);  

export const isLoading = createSelector(
    getTemplateState, (state) => {
        return state.isLoading
    }
);

export const getTemplateById = (template_id: number) =>
    createSelector(
        getTemplates,
        (templates) =>
            templates.find(t => t.template_ref === template_id)
    );



