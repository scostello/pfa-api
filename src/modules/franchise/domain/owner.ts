import { Person } from '../../../types';

interface Owner extends Person {
  readonly networth: number;
}

export { Owner }