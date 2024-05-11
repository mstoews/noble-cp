import type { User } from "firebase/auth";
import { DocumentReference, Timestamp, FieldValue } from "firebase/firestore";


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
  createDate: string;
  updateDate: string;
  updateBy: string;
  isUsed?: boolean;
}

export type CategoryRef = DocumentReference<ICategory>;
export interface CategorySnap extends ICategory {
  category: ICategory[];
}

export type IType = {
  id?: string;
  type: string;
  description: string;
  create_date: string;
  create_user: string;
  update_date: string;
  update_user: string;  
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

export interface AccountsPayableLedger {
  account: string;
  name: string;
  vendor: string;
  type: string;
  description: string;
  createDate: string;
  createUsr: string;
  updateDate: string;
  updateUsr: string;
}

export interface AccountsPayableDetail {
  account: string;
  journal_id: string;
  name: string;
  vendor: string;
  type: string;
  description: string;
  createDate: string;
  createUsr: string;
  updateDate: string;
  updateUsr: string;
}

export interface IAccounts {
  account: string;
  child: string;
  parent_account?: boolean;
  type: string;
  sub_type: string;
  balance: number;
  description: string;
  comments: string;
  status: string;
  create_date: string;
  create_user: string;
  update_date: string;
  update_user: string;
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

export interface IDistributionLedger {
  account: string;
  child: string;
  period: string;
  period_year: string;
  description: string;
  opening_balance: number;
  debit_balance: number;
  credit_balance: number;
  closing_balance: number;
  update_date: Date;
  created_user: string;
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
  create_date: string;
  create_user: string;
  update_date: string;
  update_user: string;
}


export interface ITransaction {
  booked: boolean;
  journal_id: string;
  journal_type: string;
  journal_total: number;
  description: string;
  journal_status: string;
  booked_user: string;
  booked_date?: string;
  create_date: string;
  create_user: string;
  update_date: string;
  update_user: string;
}

export interface IAccount {
  account: number;
  child: number;
  parent_account: number;
  type: string;
  sub_type: string;
  description: string;
  balance: number;
  comments: string;
  create_date: string;
  create_user: string;
  update_date: string;
  update_user: string;
}

export interface IJournalHeader {
  journal_id: string;
  journal_date: string;
  journal_type: string;
  journal_description: string;
  journal_total: number;
  journal_status: string;
  transaction_date: string;
  journal_create_date: string;
  journal_create_usr: string;
  journal_update_date: string;
  journal_update_usr: string;
}

export interface IJournalDetail {
  journal_id: string;
  journal_child_id: string;
  account: string;
  create_date: string;
  create_user: string;
  description: string;
  fund: string;
  update_date: string;
  update_user: string;
  debit: number;
  credit: number;
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







