import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MaterialModule } from 'app/material.module';
import { ImageMaintenanceComponent } from './image-maintenance/image-maintenance.component';
import { ImageSelectionComponent } from './products-image-selection/image-selection.component';
import { ImageCardComponent } from '../image-card/image-card.component';
import { InventoryImageSelectionComponent } from '../../shop/shop-inventory-maintenance/inventory-image-selection/inventory-image-selection.component';
import { CollectionImageSelectionComponent } from './collection-image-selection/collection-image-selection.component';
import { GalleryImageSelectionComponent } from './gallery-image-selection/image-selection.component';
import { ImageMgtEditComponent } from './image-edit/image-mgt-edit.component';
import { ImageMaintenanceCardComponent } from './image-maintenance-card/image-maintenance-card.component';
import { ImageMenubarComponent } from './image-menubar/image-menubar.component';
import { ThoughtsImageSelectionComponent } from './thoughts-image-selection/thoughts-image-selection.component';
import { GalleryLightboxModule } from 'app/1.modules/gallery-lightbox/gallery-lighthouse.module';
import { PolicyModule } from 'app/1.modules/policy/policy.module';
import { SharedModule } from 'app/1.modules/shared-module/shared.module';
import { HeadingModule } from 'app/2.main/header/heading.module';
import { IconsModule } from 'app/icons.module';
import {
  DxDataGridModule,
  DxBulletModule,
  DxTemplateModule,
  DxPopupModule,
  DxHtmlEditorModule,
} from 'devextreme-angular';
import { AdminRouteModule } from '../admin-route.module';
import { ViewImageItemComponent } from '../../shop/shop-inventory-maintenance/inventory-image-card/view-image-item/view-image-item.component';
import { RouterModule, Routes } from '@angular/router';
import {
  AuthGuard,
  hasCustomClaim,
} from '@angular/fire/auth-guard';
import { ImageMaintenanceRoutingModule } from './image-maintenance-routing.module';

const adminOnly = () => hasCustomClaim('admin');

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: 'Image Maintenance',
    canActivate: [AuthGuard],
    data: { authGuardPipe: adminOnly },
    component: ImageMgtEditComponent,
  },
];

@NgModule({
  declarations: [
    ImageMaintenanceComponent,
    ImageSelectionComponent,
    ImageMenubarComponent,
    ImageMaintenanceCardComponent,
    ImageMgtEditComponent,
    ImageCardComponent,
    GalleryImageSelectionComponent,
    CollectionImageSelectionComponent,
    ThoughtsImageSelectionComponent,
    InventoryImageSelectionComponent,
  ],
  imports: [
    SharedModule,
    ImageMaintenanceRoutingModule,
    MaterialModule,
    DxDataGridModule,
    DxBulletModule,
    DxTemplateModule,
    GalleryLightboxModule,
    DxPopupModule,
    DxHtmlEditorModule,
    NgOptimizedImage,
    IconsModule,
    PolicyModule,
    ViewImageItemComponent,
    HeadingModule,
  ],
  exports: [
    ImageMaintenanceComponent,
    ImageSelectionComponent,
    ImageMenubarComponent,
    ImageMaintenanceCardComponent,
    ImageMgtEditComponent,
    ImageCardComponent,
    GalleryImageSelectionComponent,
    CollectionImageSelectionComponent,
    ThoughtsImageSelectionComponent,
    InventoryImageSelectionComponent,
  ],
})
export class ImageMaintenanceModule {}
