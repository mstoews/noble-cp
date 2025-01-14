import {Injectable, signal, WritableSignal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PanelStateService {

  public lastPanelOpened: WritableSignal<string> = signal<string>("");
  public lastAccountingPanel : WritableSignal<string> = signal<string>("");
  public lastBudgetPanel : WritableSignal<string> = signal<string>("");
  public lastReportingPanel : WritableSignal<string> = signal<string>("");
  public lastProjectsPanel: WritableSignal<string> = signal<string>("");

  public setLastPanel(panel : string ) {
    this.lastPanelOpened.set(panel);
  }

  public setLastBudgetPanel(panel : string ) {
    this.lastBudgetPanel.set(panel);
  }
  public setLastReportingPanel(panel : string ) {
    this.lastReportingPanel.set(panel);
  }
  public setLastProjectsPanel(panel : string ) {
    this.lastProjectsPanel.set(panel);
  }

  public setLastAccountingPanel(panel : string ) {
    this.lastAccountingPanel.set(panel);
  }

}
