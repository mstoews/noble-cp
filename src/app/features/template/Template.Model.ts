import { IJournalTemplate,  IJournalDetailTemplate  } from  'app/models/journals';

export interface TemplateModel {
    list: IJournalTemplate[];
    isLoading: boolean;
    error: string | null;
}

