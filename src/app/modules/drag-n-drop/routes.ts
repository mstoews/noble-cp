import { Route } from '@angular/router';

import { UploaderComponent } from '././uploader/uploader.component';

export const DRAG_N_DROP_ROUTES: Route[] = [
  {
    path: '',
    component: UploaderComponent,
  },
];
