import { EntityState } from '@ngrx/signals/entities';
import { IJournalTemplate,  IJournalDetailTemplate  } from  'app/models/journals';

export interface TemplateModel  {
    list: IJournalTemplate[];
    detail: IJournalDetailTemplate[];
    isLoading: boolean;
    error: string | null;
}

