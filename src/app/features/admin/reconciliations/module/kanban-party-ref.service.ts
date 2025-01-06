import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class KanbanPartyRefService {

  constructor() { }
  partyRef: string;
  clientRef: string;
  partyType: string;

  public partyRefUpdated = new EventEmitter<any>();

  setPartyRef(partyRef: string) {
    this.partyRefUpdated.emit(partyRef);
  }

  getPartyRef() {
    return this.partyRef;
  }
  setPartyClient(clientRef: string){
    this.clientRef = clientRef;
  }
  getClientRef() {
    return this.partyRef;
  }

  setPartyType(partyType: string){
    this.partyType = partyType;
  }

  getPartyType() {
    return this.partyType;
  }
}
