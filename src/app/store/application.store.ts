import { signalStore, withComputed, withMethods, withHooks, withProps, withState, } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { PartyStore } from './party.store';
import { TemplateStore } from './template.store';
import { PeriodStore } from './periods.store';
import { AccountsStore } from './accounts.store';
import { MainPanelStore, ProfileModel } from './main.panel.store';
import { FundsStore } from './funds.store';


export interface ApplicationStateInterface {
  currentPeriod: string;
  currentYear: string;
  isLoading: boolean;
  error: string | null;
  uid: string | null;
  profile: ProfileModel | null;
}

export const ApplicationStore = signalStore(
  { providedIn: 'root' },
  withState<ApplicationStateInterface>({
    isLoading: false,
    currentPeriod: '',
    error: null,
    currentYear: '',
    uid: '',
    profile: null,
  }),
  withProps(_ => ({
    _partyStore: inject(PartyStore),
    _templateStore: inject(TemplateStore),
    _accountsStore: inject(AccountsStore),
    _periodStore: inject(PeriodStore),
    _fundsStore: inject(FundsStore),
    _mainPanelStore: inject(MainPanelStore),

  })),
  withMethods((state => ({
    loadTemplates: state._templateStore.readTemplate,
    loadAccounts: state._accountsStore.readAccounts,
    loadParties: state._partyStore.readParty,
    loadPeriod: state._periodStore.loadPeriods,
    loadProfile: state._mainPanelStore.loadProfile,
    panels: state._mainPanelStore.panels,
    userID: state._mainPanelStore.uid,
    loadPanels: state._mainPanelStore.loadPanels,
    loadFunds: state._fundsStore.loadFunds,
    setProfile: (profile: ProfileModel) => state._mainPanelStore.setProfile(profile),
  }))),
  withComputed((state) => ({
    vm: computed(() => ({
      tmp: state._templateStore.tmp(),
      accounts: state._accountsStore.accounts(),
      party: state._partyStore.party(),
      periods: state._periodStore.periods(),
      currentPeriod: state.currentPeriod(),
      currentYear: state.currentYear(),
      uid: state.uid(),
      profile: state.profile(),

    }))
  })),

  withHooks({
    onInit(store) {
      const uid = store.userID();
      store.loadProfile(uid);
      store.loadPanels(uid);
      store.loadAccounts();
      store.loadParties();
      store.loadPeriod();

    },
  })

);