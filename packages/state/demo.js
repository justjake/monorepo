"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const jotai_1 = require("jotai");
const store_1 = require("jotai/core/store");
function main() {
    const base = (0, jotai_1.atom)(1);
    const fib = (0, jotai_1.atom)((get) => get(base) + get(fib));
    const store = (0, store_1.createStore)();
    const fibValue = store[store_1.READ_ATOM](fib);
    assert.equal(fibValue, 2);
}
main();
//# sourceMappingURL=demo.js.map