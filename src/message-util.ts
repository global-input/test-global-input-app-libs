import {ConnectOptions,RegisteredCallback,InputMessage,PermissionMessage,CodeDataCallbacks,CodeData} from 'global-input-message';

type AsyncGetMessage<T> = () => Promise<T>;

export function asyncOnRegistered(connectOption:ConnectOptions):AsyncGetMessage<void>{        
    const promise= new Promise<void>((resolve,reject)=>{
                  connectOption.onRegistered=(next:RegisteredCallback)=>{
                        console.log("receiver registered");
                        next();
                        resolve();              
                  };
                  connectOption.onError=(message:string)=>reject(message);
          });  
    return async () => promise;
}
  

export function asyncOnInput (connectOption:ConnectOptions):AsyncGetMessage<InputMessage>{
        const promise  = new Promise<InputMessage>((resolve,reject)=>{
          connectOption.onInput=(message:InputMessage)=>{            
                resolve(message);              
          };      
        });
        return async ()=>promise;
}


 export function asyncOnInputPermissionResult(connectOption:ConnectOptions):AsyncGetMessage<PermissionMessage>{
  const promise = new Promise<PermissionMessage>((resolve,reject)=>{
        connectOption.onInputPermissionResult=(message:PermissionMessage)=>{            
              resolve(message);              
        };      
      });
  return async ()=>promise;
  }        

  export  function asyncCodeDataCallbacks(codeDataCallbacks:CodeDataCallbacks):AsyncGetMessage<CodeData>{
    const promise= new Promise<CodeData>((resolve,reject)=>{
      codeDataCallbacks.onInputCodeData=(codeData:CodeData)=>{            
            resolve(codeData);              
      };  
      codeDataCallbacks.onError=(opts:CodeDataCallbacks, message:string, error:any)=>{            
        console.log(`error received:${message} ${error}`);
        reject(message);              
      }; 
      codeDataCallbacks.onPairing = (codeData:CodeData) => {            
        resolve(codeData);              
      }; 
    });
    return async ()=>promise;
  };