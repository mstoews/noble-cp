import { Routes } from '@angular/router';
import { ARJournalListComponent } from '../ar-journal-list.component';

export default [
    {
        path: '',
        component: ARJournalListComponent,
        // resolve: { journal: JournalEditResolver },
    },

] as Routes;
