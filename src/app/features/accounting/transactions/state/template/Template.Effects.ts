import { Actions, createEffect, ofType } from "@ngrx/effects";
import { TemplateService } from "app/services/template.service";
import { exhaustMap, map, catchError, of } from "rxjs";
import { TemplateActions } from "./Template.Action";
import { inject } from "@angular/core";

export class templateEffects {

    private templateService = inject (TemplateService);
    private actions = inject(Actions);

    _loadTemplates = createEffect(() => this.actions.pipe(
        ofType(TemplateActions.loadTemplates),
        exhaustMap(() => {
            return this.templateService.read().pipe(
                map((data) => TemplateActions.loadTemplatesSuccess({ list: data })),
                catchError((error) => of(TemplateActions.loadTemplatesFailure({ error })))
            )
        })
      )
    );

    _loadTemplatesDetails = createEffect(() => this.actions.pipe(
        ofType(TemplateActions.loadTemplatesDetails),
        exhaustMap((action) => {
            return this.templateService.readTemplateDetails(action.ref).pipe(
                map((data) => TemplateActions.loadTemplatesDetailsSuccess({ detail: data })),
                catchError((error) => of(TemplateActions.loadTemplatesDetailsFailure({ error })))
            )
        })
      )
    );

    _createTemplates = createEffect(() => this.actions.pipe(
        ofType(TemplateActions.createTemplates),
        exhaustMap((action) => {
            return this.templateService.create(action.template).pipe(
                map((data) => TemplateActions.createTemplatesSuccess({ list: data })),
                catchError((error) => of(TemplateActions.createTemplatesFailure({ error })))
            )
        })
      )
    );

    
}
