import { AccountsService } from "./accounts.service";
import { BudgetService } from "./budget.service";
import { BudgetStore } from "./budget.store";
import { DashboardService } from "./dashboard.service";
import { TrialBalanceStore } from "./distribution.ledger.store";


export const nobleServices = [
    AccountsService,
    BudgetService,
    BudgetStore,
    DashboardService,
    TrialBalanceStore
]