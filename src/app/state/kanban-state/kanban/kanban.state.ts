import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { IKanban } from 'app/models/kanban';
import { KanbanAPIActions } from './actions/kanban.actions';
import { KanbanPageActions } from './actions/kanban-page.actions';

export interface KanbanState {
  tasks: EntityState<IKanban>;
  loading: boolean;
  errorMessage: string;
  // ids: string[] | number[];
  // entities: Dictionary<T>;
}

export const kanbanAdapter: EntityAdapter<IKanban> = createEntityAdapter();

const initialState: KanbanState = {  
  tasks: kanbanAdapter.getInitialState(),
  loading: false,
  errorMessage: '',
  // ids: string[] | number[];
  // entities: Dictionary<T>;
};

const reducer = createReducer(
  initialState,
  on(KanbanPageActions.load, (state) => ({ ...state, isLoading: true })),
  on(KanbanPageActions.select, (state, { id }) => ({
    ...state,
    selectedId: id,
  })),
  on(KanbanAPIActions.loadKanbanSuccess, (state, { Kanban }) => ({
    ...state,
    Kanban,
    isLoading: false,
  })),
  on(KanbanAPIActions.loadKanbanFailure, (state) => ({
    ...state,
    isLoading: false,
  }))
);


export const kanbanFeature = createFeature({
  name: 'kanban',
  reducer: createReducer(
  initialState,

  on(KanbanPageActions.load, (state) => ({
    ...state,
    loading: true,
    errorMessage: '',
  })),
  on(KanbanAPIActions.loadKanbanSuccess, (state, { Kanban: kanban }) => ({    
      ...state,
      tasks: kanbanAdapter.upsertMany(kanban, state.tasks),
      loading: false,
      errorMessage: '',
    })
  ),
  on(KanbanAPIActions.loadKanbanFailure, (state, { error }) => ({
    ...state,
    loading: false,
    errorMessage: error,
  })),
  // on(KanbanAPIActions.addKanban, (state) => ({
  //   ...state,
  //   loading: true,
  //   errorMessage: '',
  // })),
  // on(KanbanAPIActions.kanbanAddedSuccess, (state, { tasks: kanban }) => ({    
  //   ...state,
  //   tasks: kanbanAdapter.addOne(kanban, state.tasks),
  //   loading: false,
  //   errorMessage: '',
  //   })
  // ),
  // on(KanbanAPIActions.kanbanAddedFail, (state, { message }) => ({
  //   ...state,
  //   loading: false,
  //   errorMessage: message,
  // })),
  // on(KanbanAPIActions.updateKanban, (state) => ({
  //   ...state,
  //   loading: true,
  //   errorMessage: '',
  // })),
  // on(KanbanAPIActions.kanbanUpdatedSuccess, (state, { update }) => ({    
  //   ...state,
  //   tasks: kanbanAdapter.updateOne( update, state.tasks),
  //   loading: false,
  //   errorMessage: '',
  //   })
  // ),
  // on(KanbanAPIActions.kanbanUpdatedFail, (state, { message }) => ({
  //   ...state,
  //   loading: false,
  //   errorMessage: message,
  // })),
  // on(KanbanAPIActions.deleteKanban, (state) => ({
  //   ...state,
  //   loading: true,
  //   errorMessage: '',
  // })),
  // on(KanbanAPIActions.kanbanDeletedSuccess, (state, { id }) => ({    
  //   ...state,
  //   tasks: kanbanAdapter.removeOne( id, state.tasks),
  //   loading: false,
  //   errorMessage: '',
  //   })
  // ),
  // on(KanbanAPIActions.kanbanDeletedFail, (state, { message }) => ({
  //   ...state,
  //   loading: false,
  //   errorMessage: message,
  // }))  
  )
});

export const kanbansFeature = createFeature({
  name: 'kanbanFeature',
  reducer
})



