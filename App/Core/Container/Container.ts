// this would be a container for singletons?
// in ex. Logger?

type Singleton<T> = {
  name: string;
  instance: T;
};

export class Container {
  static instance: Container | null = null;
  static singletons: any            = [];

  constructor() {
    if ( !Container.instance ) {
      Container.instance = new Container();
    }
  }

  static getInstance(): Container | null {
    if ( !Container.instance ) {
      Container.instance = new Container();
    }

    return this.instance;
  }

  static push<T>(singleton: T) {
    console.log(typeof singleton);
    const s: Singleton<T> = {
      name: 'hi',
      instance: singleton,
    };
    this.singletons.push(s);

    console.log(this.singletons);
  }

  static get(name: string) {
    return this.singletons.find((s: Singleton<any>) => s.name === name);
  }
}
