export type OrderDirection = 'asc' | 'desc';

export interface OrderCriteria {
  readonly direction: OrderDirection;
  readonly field: string;
}

export interface FetchCriteria {
  readonly cursor?: string;
  readonly first?: number;
  readonly orderBy?: OrderCriteria;
}
