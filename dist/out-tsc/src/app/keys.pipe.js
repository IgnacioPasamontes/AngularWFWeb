import * as tslib_1 from "tslib";
import { Pipe } from '@angular/core';
let KeysPipe = class KeysPipe {
    transform(value, args) {
        let keys = [];
        for (let key in value) {
            keys.push(key);
        }
        return keys;
    }
};
KeysPipe = tslib_1.__decorate([
    Pipe({ name: 'keys' })
], KeysPipe);
export { KeysPipe };
//# sourceMappingURL=keys.pipe.js.map