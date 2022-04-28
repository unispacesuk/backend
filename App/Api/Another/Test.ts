export class Test {
  name: string;
  surname: string;

  constructor(name: string, surname: string) {
    this.name = name;
    this.surname = surname;
  }

  getFullName(): string {
    return this.name + ' ' + this.surname;
  }
}
