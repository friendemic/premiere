export type PromiseFunction = (...args: any[]) => Promise<any>;
export type StackItem = { fn: PromiseFunction, args: any[] };

export default class PromiseCascade {
    stack: StackItem[] = [];

    push(fn: PromiseFunction, ...args: any[]): this {
        this.stack.push({fn, args});
        return this;
    }

    play(): Promise<any> {
        if (!this.stack.length) {
            throw 'Empty promise cascade stack';
        }

        let callback: PromiseFunction;

        this.stack.reverse().forEach((item) => {
            const lastCallback = callback;
            callback = () => item.fn(...item.args, lastCallback);
        });

        return callback();
    }

    clear() {
        this.stack = [];
    }
}
