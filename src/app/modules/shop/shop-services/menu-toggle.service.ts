import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuToggleService {

  constructor() { }
  
  public drawerOpen: boolean
  public wishListCount: number;
  public cartListCount: number; 

  public toggleDrawer = new EventEmitter<boolean>();

  public wishList = new EventEmitter<number>();
  public cart = new EventEmitter<number>();

  openDrawer() {
    this.drawerOpen = true;
  }

  closeDrawer() {
    this.drawerOpen = false;
  }

  getDrawerState(): boolean {
    return this.drawerOpen;
  }

  setCartListCount(count: number){
    this.cartListCount = count;
    this.cart.emit(count);
  }

  setWishListCount(count: number) {
    this.wishListCount = count;
    this.wishList.emit(count);
  }

  setDrawerState(toggle: boolean) {
    this.drawerOpen = toggle;
    this.toggleDrawer.emit(toggle);
  }
}


/**
 * 
 *  private kanbanPartyRefService: KanbanPartyRefService
  ) {
     this.kanbanPartyRefService.partyRefUpdated.subscribe(val => {
        console.debug(val);
        this.partyRef = val;
        this.refreshData(this.partyRef);
     });
    }

 */