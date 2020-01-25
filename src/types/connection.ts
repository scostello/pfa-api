export interface Node {
  readonly cursor: string;
}

export interface Edge<T extends Node> {
  readonly node: T;
  readonly cursor: string;
}

export interface PageInfo {
  readonly startCursor: string;
  readonly endCursor: string;
}
