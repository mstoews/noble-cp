import { IKanban } from '../models/kanban';

export const sumProducts = (products: IKanban[]) =>
  products.reduce((acc: number, cur) => acc + cur.estimate, 0);
