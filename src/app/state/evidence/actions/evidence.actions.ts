import { createActionGroup, props } from '@ngrx/store';
import { IArtifacts } from 'app/models/journals';

export const artifactsAPIActions = createActionGroup({
  source: 'Artifacts API',
  events: {
    'Load Artifacts Success': props<{ artifacts: IArtifacts[] }>(),
    'Load Artifacts Failure': props<{ error: string }>(),
    'Delete Budget Success': props<{ child: number }>(),
    'Delete Budget Failure': props<{ error: string}>(),
  },
});
