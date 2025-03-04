import type { User } from "firebase/auth";
import { DocumentReference, Timestamp, FieldValue } from "firebase/firestore";
import * as subtypes from './subtypes';
import { AcroFormButton } from "jspdf";

export interface IDashboardFund {
  fund: string,
  amount: number;
  updatedTime: Timestamp;  
  description: string
}


export interface ITasks {
  task_id: string;
  title: string;
  status: string;
  summary: string;
  type: string;
  priority: string;
  tags: string;
  estimate: number;
  assignee: string;
  rankid: number;
  color: string;
  classname: string;
  dependencies: string;
  description: string;
  due_date: Date;
  start_date: Date;
}


export interface ICategory {
  id?: string;
  name: string;
  description: string;
  jp_description?: string;
  image: string;
  createDate: Date;
  updateDate: string;
  updateBy: string;
  isUsed?: boolean;
}

export type CategoryRef = DocumentReference<ICategory>;
export interface CategorySnap extends ICategory {
  category: ICategory[];
}

export type NobleLedgerUser = {
  photoURL: string | null;
  displayName: string | null;
  uid: string | null;
}

export interface UserRoles {
  admin: boolean;
}

// General Ledger Accounts Listing

export interface IAccountsPayableLedger {
  account: string;
  name: string;
  vendor: string;
  type: string;
  description: string;
  createDate: Date;
  createUsr: string;
  updateDate: string;
  updateUsr: string;
}

export interface IAccountsPayableDetail {
  account: string;
  journal_id: string;
  name: string;
  vendor: string;
  type: string;
  description: string;
  createDate: Date;
  createUsr: string;
  updateDate: string;
  updateUsr: string;
}

export interface IDropDownAccountsGridList {
  childName: number;
  descriptionName: string;
}

export interface IDropDownAccounts {
  account: string;
  child: string;
  description: string;
}

export interface IDropDown {
  value: string;
  description: string;
}



export interface IBudget {
    child : number;
    period_year : number; 
    sub_type : string;
    description : string;
    amount : number;
    reference : string;
    create_date : string;
    create_user : string;
    update_date : string;
    update_user : string;
}

export interface IDistributionReport {
  journal_id: number,
  prd: number,
  year: number,
  description: string,
  account: number,
  child: number,
  open: number,
  debit: number,
  credit: number,
  closing: number,
  update_user: string,
  update_date: Date    
}

export interface IJournalParams {    
  child: number,
  period: number,
  period_year: number
}

export interface IDistributionParams {
  period : number,
  period_year: number

}

export interface IDistributionLedger {
  account: number;
  child: number;
  period: number;
  period_year: number;
  description: string;
  opening_balance: number;
  debit_balance: number;
  credit_balance: number;
  closing_balance: number;
  update_date: Date;
  created_user: string;
}

export interface IDistributionLedgerRpt {
 
  child: number;
  description: string;
  opening_balance: number;
  debit_balance: number;
  credit_balance: number;
  closing_balance: number;
 
}

export interface IDistributionComparisonRpt {
 
  child: number;
  description: string;
  opening_balance: number;
  closing_balance: number;
  difference: number;
  percentage: number;
}


export interface IJournalSummary {
  journal_id      : number,
  journal_subid   : number,
  account         : number,
  child           : number,
  fund?           : string,
  sub_type?       : string,
  description     : string,
  debit           : number,
  credit          : number,
  create_date     : string,
  create_user     : string,
  reference       :string,
  period          : number,
  period_year     : number
}



export interface IDistributionLedgerReport {
  account:             number; 
  child:               number; 
  account_description: string; 
  period:              number; 
  period_year:         number; 
  journal_id:          number; 
  description:         string; 
  opening_balance:     number;
  debit:               number;
  credit:              number;
  closing_balance:     number;
  create_date:         Date;
  create_user:         string;
}


export interface IFunds {
  id?: string;
  fund: string;
  description: string;
  create_date?: string;
  create_user?: string;
}


export interface ITrialBalance {
  account : number;
  child : number;
  account_description: string;
  transaction_date: Date;
  id: string;
  trans_type: string;
  trans_date: Date;
  type: string;
  description: string;
  reference: string;
  party_id: string;
  amount: number;
  opening_balance: number;
  debit_amount: number;
  credit_amount: number;
  close: number;
  net: number;
  pd: number;
  prd_year: number;
}
export interface IAccounts {
  id?: number;
  account: number;
  child: number;
  parent_account: boolean;
  acct_type: string;
  sub_type: string;
  description: string;
  status?: string;
  balance: number;
  comments: string;
  create_date: string;
  create_user: string;
  update_date: string;
  update_user: string;
}

export interface IAccountSettings {
  ar: string;
  ap: string;
  apc: string;
  arc: string;
} 


export interface imageItem {
  id: string;
  parentId: string;
  imageSrc: string;
  imageSrc200?: string;
  imageSrc400?: string;
  imageSrc800?: string;
  largeImageSrc: string;
  imageAlt: string;
  caption: string;
  type: string;
  ranking?: number;
  description?: string;
  size?: string;
}

export interface ImageItemIndex {
  id: string;
  fullPath: string;
  size: string;
  fileName: string;
  contentType: string;
  imageSrc200?: string;
  imageSrc400?: string;
  imageSrc800?: string;
  type?: string;
  ranking?: number;
  description?: string;
  parentId?: string;
  imageSrc?: string;
  imageAlt?: string;
  caption?: string;
  category?: string;
}


export interface imageItemIndexMap {
  [key: string]: ImageItemIndex;
}

export interface imageItemPartial {
  id?: string;
  imageSrc: string;
  imageAlt: string;
  caption: string;
  type: string;
  description?: string;
}

interface HashMap<T> {
  [key: string]: T;
}


export interface ImageItemSnap extends imageItem {
  images: imageItem[];
}

export interface IImageMaintenance {
  id: number;
  title: string;
  sub_title: string;
  image_url: string;
  applied: boolean;
  user_updated: string | null | undefined;
  date_created: FieldValue;
  date_updated: FieldValue;
}

export interface Collection {
  id: number;
  title: string;
  color: string;
  price: string;
  sub_title: string;
  image_url: string;
  applied: boolean;
  user_updated: string | null | undefined;
  date_created: string;
  date_updated: string;
}


export interface IImageStorage {
  name: string;
  parentId: string;
  url: string | null;
  version_no: number;
}






