import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { IArtifacts } from 'app/models/journals';

export const artifactsPageActions = createActionGroup({
  source: 'Artifacts Page',
  events: {
    load: emptyProps(),
    update: props<IArtifacts>(),
    delete: props<IArtifacts>(),
    select: props<IArtifacts>(),
  },
});
