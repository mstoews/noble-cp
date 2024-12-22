import { Actions, createEffect, ofType } from "@ngrx/effects";
import { TemplateService } from "app/services/template.service";
import { exhaustMap, map, catchError, of } from "rxjs";
import { loadTemplates, loadTemplatesFailure, loadTemplatesSuccess, TemplateActions } from "./Template.Action";
import { inject } from "@angular/core";

export class templateEffects {

    private templateService = inject (TemplateService);
    private actions = inject(Actions);

    _loadTemplates = createEffect(() => this.actions.pipe(
        ofType(loadTemplates),
        exhaustMap(() => {
            return this.templateService.read().pipe(
                map((data) => loadTemplatesSuccess({ templates: data })),
                catchError((error) => of(loadTemplatesFailure({ error })))
            )
     })))           
}