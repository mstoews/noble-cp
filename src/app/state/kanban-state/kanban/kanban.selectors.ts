import { getRouterSelectors } from '@ngrx/router-store';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromKanban from './kanban.reducer';
import { kanbanFeature } from './kanban.reducer';
import { sumProducts } from 'app/utils/sum-products';

export const selectKanbanState = createFeatureSelector<fromKanban.KanbanState>('kanban');
const { selectAll, selectEntities } = fromKanban.kanbanAdapter.getSelectors();

export const selectKanban = createSelector(
  kanbanFeature.selectTasks,
  selectAll
);

export const selectKanbanEntities = createSelector(
  kanbanFeature.selectTasks,
  selectEntities
);

export const selectKanbanLoading = createSelector(
  selectKanbanState,
  (kanbanState) => kanbanState.loading
);

// export const selectProductsShowProductCode = createSelector(
//   selectKanbanState,
//   (kanbanState) => kanbanState.showKanbanCode
// );

export const selectKanbanErrorMessage = createSelector(
  selectKanbanState,
  (kanbanState) => kanbanState.errorMessage
);

export const selectKanbanTotal = createSelector(selectKanban, sumProducts);

export const { selectRouteParams } = getRouterSelectors();

export const selectKanbanById = createSelector(
  selectKanbanEntities,
  selectRouteParams,
  (kanbanEntities, { id }) => kanbanEntities[id]
);
