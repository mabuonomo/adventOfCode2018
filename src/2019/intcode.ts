export class IntCode {
  registry: Array<number>;
  input: number;

  constructor(registry: Array<number>, input: number) {
    this.registry = registry;
    this.input = input;
  }

  getRegistry() {
    return this.registry;
  }

  run(): number {
    for (let i = 0; i < this.registry.length; i++) {
      let res = this.execute(i);

      if (res !== undefined) return res;
    }

    return undefined;
  }

  execute(i: number): any {
    let op = this.buildOP(i);

    if (op == undefined) {
      return;
    }

    let param1 = 0;
    let param2 = 0;

    if (op.first == Mode.POSITION) {
      param1 = this.registry[this.registry[i + 1]];
    } else {
      param1 = this.registry[i + 1];
    }

    if (op.second == Mode.POSITION) {
      param2 = this.registry[this.registry[i + 2]];
    } else {
      param2 = this.registry[i + 2];
    }

    // console.log(param1, param2)

    switch (op.code) {
      case 1:
        let add1 = param1;
        let add2 = param2;
        if (op.third == Mode.POSITION) {
          this.registry[this.registry[i + 3]] = add1 + add2;
        } else {
          this.registry[i + 3] = add1 + add2;
        }
        break;
      case 2:
        let mul1 = param1;
        let mul2 = param2;
        if (op.third == Mode.POSITION) {
          this.registry[this.registry[i + 3]] = mul1 * mul2;
        } else {
          this.registry[i + 3] = mul1 * mul2;
        }
        break;
      case 3:
        if (op.first == Mode.POSITION) {
          this.registry[this.registry[i + 1]] = this.input;
        } else {
          this.registry[i + 1] = this.input;
        }
        break;
      case 4:
        if (op.first == Mode.POSITION) {
          return this.registry[this.registry[i + 1]];
        } else {
          return this.registry[i + 1];
        }
      // break;
      case 99:
        return this.registry[0];
      //     return true;
    }

    return undefined;
  }

  buildOP(i: number): IntOP {
    let op = this.registry[i].toString();

    if (op.length < 3) {
      return undefined;
    }

    if (op.length === 4) {
      op = '0' + op;
    }

    if (op.length === 3) {
      op = '00' + op;
    }

    return {
      third: this.getMode(parseInt(op.charAt(0))),
      second: this.getMode(parseInt(op.charAt(1))),
      first: this.getMode(parseInt(op.charAt(2))),
      code: parseInt(op.substring(3)),
    };
  }

  getMode(n: number) {
    if (n == 0) return Mode.POSITION;

    return Mode.IMMEDIATE;
  }
}

type IntOP = { third: Mode; second: Mode; first: Mode; code: number };

enum Mode {
  POSITION, // by address
  IMMEDIATE, // by value
}
