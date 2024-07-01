import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DeleteDuplicateService } from '../../shop-services/delete-duplicate.service';


@Component({
  selector: 'app-image-mgt-edit',
  templateUrl: './image-mgt-edit.component.html',
  styleUrls: ['./image-mgt-edit.component.css'],
})
export class ImageMgtEditComponent {
  deleteDupesService = inject(DeleteDuplicateService);

  route = inject(Router);

  onBackToInventory() {
    this.route.navigate(['home']);
  }

  createImageOnce() {
    console.debug('createImageOnce');
  }

  RefreshList() {
    //this.deleteDupesService.updateUsedImageList();
  }

  RefreshImageList() {
    //this.deleteDupesService.updateImageIndexList('400')
  }
  DeleteDupes() {
    //this.deleteDupesService.deleteDuplicateImages();
  }

  async RefreshImages() { }
}
