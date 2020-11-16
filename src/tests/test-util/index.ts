import { GlobalInputMessageConnector, InitData } from "global-input-react"; //import types;

import { PromiseMessageReceiver, createInputReceivers } from './promising-callbacks';

export { createInputReceivers };

//export  {createInputReceivers,PromiseMessageReceiver,MessageReceiver};
//export {createInputReceivers,PromiseMessageReceiver,MessageReceiver};
declare global {
    namespace jest {
        interface Matchers<R> {
            toBeSameInitData(expected: any): CustomMatcherResult
        }
    }
}



export interface TestApp {
    con: GlobalInputMessageConnector;
    receiver: PromiseMessageReceiver;
    ui?: InitData | null;
    message?: any;
};

export interface TestAppReact {
    hook: any;
    receiver: PromiseMessageReceiver;
    ui: InitData;
    message?: any;
};
export interface TestAppReact2 {
    hook: any;
    ui: InitData;
    listener: any;
    calls: any[];
};

export interface DeviceApp {
    hook: any;
    ui?: InitData;
    message?: any;
    codeAES?: string;
};

/**
 * compare initData to expectedInitData
 * @param {*} initData
 * @param {*} expectedInitData
 */


export function toBeSameInitData(received: any, expected: any) {
    if (received.action !== expected.action) {
        if ((!expected.action) && received.action === 'input') {
            console.log("used the default, that is fine");
        }
        else {
            return {
                pass: false,
                message: () => `action = "${expected.action}" is expected but received "${received.action}" instead`
            };
        }

    }
    if (received.dataType !== expected.dataType) {
        return {
            pass: false,
            message: () => `dataType = "${expected.dataType}" is expected but received "${received.dataType}" instead`
        };
    }
    if (received.form.id !== expected.form.id) {
        return {
            pass: false,
            message: () => `form.id = "${expected.form.id}" is expected but received "${received.form.id}" instead`
        };
    }
    if (received.form.title !== expected.form.title) {
        return {
            pass: false,
            message: () => `form.title = "${expected.form.title}" is expected but received "${received.form.title}" instead`
        };
    }
    if (received.form.label !== expected.form.label) {
        return {
            pass: false,
            message: () => `form.label = "${expected.form.label}" is expected but received "${received.form.label}" instead`
        };
    }
    for (const [index, field] of expected.form.fields.entries()) {
        if (field.label !== received.form.fields[index].label) {
            return {
                pass: false,
                message: () => `form.fields[${index}].label = "${field.label}" is expected but received "${received.form.fields[index].label}" instead`
            };
        }
        if (field.id !== received.form.fields[index].id) {
            return {
                pass: false,
                message: () => `form.fields[${index}].id = "${field.id}" is expected but received "${received.form.fields[index].id}" instead`
            };
        }
        if (field.value !== received.form.fields[index].value) {
            return {
                pass: false,
                message: () => `form.fields[${index}].value = "${field.value}" is expected but received "${received.form.fields[index].value}" instead`
            };
        }
        if (field.nLines !== received.form.fields[index].nLines) {
            return {
                pass: false,
                message: () => `form.fields[${index}].nLines = "${field.nLines}" is expected but received "${received.form.fields[index].nLines}" instead`
            };
        }
    }

    return {
        pass: true,
        message: () => `received initData contains the same data as in the expected initData`
    };
}
