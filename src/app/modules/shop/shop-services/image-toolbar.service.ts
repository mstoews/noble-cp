import { Injectable, signal } from '@angular/core';


export enum FilterEnum {
  all = 'all',
  not_used = 'IN_NOT_USED',
  collection = 'collection',
}



@Injectable({
  providedIn: 'root'
})
export class ImageToolbarService {

  filterSig = signal<FilterEnum>(FilterEnum.all);


  changeFilter(filterName: FilterEnum): void {
    this.filterSig.set(filterName);
  }

  constructor() { }
}
