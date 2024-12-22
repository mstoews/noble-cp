import { createFeatureSelector, createSelector } from "@ngrx/store";import { TemplateModel } from "./Template.Model";

const getTemplateState = createFeatureSelector<TemplateModel>('tpl');

export const getTemplates = createSelector(
    getTemplateState, (state) => { 
        return state.list
    }
);


