interface PersonName {
  readonly title: string;
  readonly first: string;
  readonly middle: string;
  readonly last: string;
  readonly suffix: string;
}

interface Person {
  readonly name: PersonName;
  readonly dob: Date;
  readonly height: number;
  readonly weight: number;
}

export { Person, PersonName };
