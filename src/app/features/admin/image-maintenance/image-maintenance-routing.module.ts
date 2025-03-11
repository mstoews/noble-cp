import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImageMgtEditComponent } from './image-edit/image-mgt-edit.component';
import { CollectionImageSelectionComponent } from './collection-image-selection/collection-image-selection.component';


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: 'Image Maintenance',
    component: CollectionImageSelectionComponent,
    data: { state: 'image-maintenance' },
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [ImageMaintenanceRoutingModule],
})
export class ImageMaintenanceRoutingModule {}
