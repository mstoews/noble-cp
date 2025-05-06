import { Routes } from '@angular/router';
import { GLJournalListComponent } from '../gl-journal-list.component';

export default [
    {
        path: '',
        component: GLJournalListComponent,
        // resolve: { journal: JournalEditResolver },
    },

] as Routes;
