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

            // console.log(res)
            if (res.output !== undefined) return res.output;

            i += res.incr;
        }

        return undefined;
    }

    execute(i: number): Result {
        let op = this.buildOP(i);

        if (op == undefined) {
            return { res: false, incr: 0, output: undefined };
        }

        let param1 = op.first == Mode.POSITION ? this.registry[this.registry[i + 1]] : this.registry[i + 1];
        let param2 = op.second == Mode.POSITION ? this.registry[this.registry[i + 2]] : this.registry[i + 2];

        switch (op.code) {
            case 1:
                this.registry[this.registry[i + 3]] = param1 + param2;
                return { res: false, incr: 4, output: undefined };
            case 2:
                this.registry[this.registry[i + 3]] = param1 * param2;
                return { res: false, incr: 4, output: undefined };
            case 3:
                this.registry[this.registry[i + 1]] = this.input;
                return { res: false, incr: 1, output: undefined };
            case 4:
                return { res: true, incr: 0, output: param1 };
            case 99:
                return { res: true, incr: 0, output: this.input };
        }

        return { res: false, incr: 0, output: undefined };
    }

    buildOP(i: number): IntOP {
        let op = this.registry[i].toString();

        if (op.length === 4 && parseInt(op.charAt(0)) < 2 && parseInt(op.charAt(1)) < 2) {
            op = '0' + op;
        }

        if (op.length === 3 && parseInt(op.charAt(0)) < 2) {
            op = '00' + op;
        }

        if (op.length === 2 && parseInt(op) == 99) {
            op = '000' + op;
        }

        if (op.length !== 5) {
            return undefined;
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

type Result = { res: boolean; incr: number; output: number };
