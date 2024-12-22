
import { IJournalTemplate,  IJournalDetailTemplate  } from  'app/models/journals';

export interface TemplateModel {
    templatesList: IJournalTemplate[];
    isLoading: boolean;
    error: string | null;
}

