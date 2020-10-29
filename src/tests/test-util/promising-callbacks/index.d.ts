import {ConnectOptions,InputMessage,FieldValue} from "global-input-message"; //import types;


    export interface MessageReceiver<T> {
        get: () => Promise<T>;
    }
    export interface PromiseMessageReceiver {
        config: ConnectOptions;
        input: MessageReceiver<InputMessage> | null;
        inputs: MessageReceiver<FieldValue>[] | null;
    }
    export function createInputReceivers(config?: ConnectOptions): PromiseMessageReceiver;
