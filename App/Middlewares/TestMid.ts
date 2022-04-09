import mid from '../Core/Decorators/MidDecorator';

@mid()
export class TestMid {

  somePrint() {
    console.log('this print...');
  }

}
