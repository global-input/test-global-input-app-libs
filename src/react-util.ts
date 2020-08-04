
type InitData=import('global-input-react').InitData;
type ConnectOptions=import('global-input-react').ConnectOptions;
type CodeData=import('global-input-message').CodeData;
type PermissionMessage=import('global-input-message').PermissionMessage;
type CodeDataCallbacks=import('global-input-message').CodeDataCallbacks;
type GlobalInputMessageConnector=import('global-input-message').GlobalInputMessageConnector;
type InputMessage=import("global-input-message").InputMessage;

type ReceivedFieldInputMessage = ()=>any;
export interface Device {
    receiveFieldInputMessages?:ReceivedFieldInputMessage[];//each return promise for receiving message corresponding to each form field
    setFieldValueById?:(fieldId:string, valueToSet:any)=>void; //used for sending field messages to mobile
    setInitData?:(initData:InitData,options?:ConnectOptions)=>void;  //used for sending InitData
    code?:string;
}


export const setCallbacksOnInitData=(initData:InitData,device:Device)=>{    
    if (!initData || !initData.form) {
        throw new Error("initData.form is missing");
    }
    device.receiveFieldInputMessages=[]; 
    for(const field of initData.form.fields){
        const promise = new Promise((resolve, reject) => {        
            field.operations = {
                onInput: (message) => resolve(message)
            };
        });
        device.receiveFieldInputMessages.push(async () => promise);
    }
}

export interface Mobile extends CodeDataCallbacks{
    connector:GlobalInputMessageConnector;
    getConnectionCode?:()=>Promise<CodeData>;
    getPermissionMessage?:()=>Promise<PermissionMessage>;
    getInputMessage?:()=>Promise<InputMessage>;
}
export const setCodeDataCallbacks = (callbacks:Mobile) => {
    const promise = new Promise<CodeData>((resolve, reject) => {
        callbacks.onInputCodeData = (codeData:CodeData) => {
            resolve(codeData);
        };
        callbacks.onError = (opts:any, message:string, error:any) => {
            console.log(`error received:${message} ${error}`);
            reject(message);
        };
        callbacks.onPairing = (codeData:CodeData) => {
            resolve(codeData);
        };
    });
    callbacks.getConnectionCode= async () => promise;
};


export const setCallbacksOnMobileConfig = (callbacks:Mobile,connectOption:import('global-input-message').ConnectOptions) => {
    const promisePermission = new Promise<PermissionMessage>((resolve, reject) => {
        connectOption.onInputPermissionResult = (message) => {
            resolve(message);
        };
    });
    callbacks.getPermissionMessage= async () => promisePermission;
    
    const promiseInput= new Promise<InputMessage>((resolve, reject) => {
        connectOption.onInput = (message) => {
            resolve(message);
        };
    });
    callbacks.getInputMessage = async () => promiseInput;    
}