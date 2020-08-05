import React from 'react';
import {useGlobalInputApp} from 'global-input-react';



export const TestWithContentTransferForm=()=>{
  const initData={
    action:"input",
    dataType:"form",
    form:{            
      title:"Content Transfer",            
      fields:[{
        label:"Content",
        id:"content",
        value:"",
        nLines:10            
    }]
    }
};  
let {connectionMessage,WhenConnected, WhenDisconnected,values,setters}=useGlobalInputApp({initData});
const [content]=values;
const [setContent]=setters;

return(
    <div>
       <div>{connectionMessage}</div>
                <WhenConnected>
                        <textarea style={{width:500, height:500}} value={content as string} onChange={evt => {
                            setContent(evt.target.value);                                   
                        }}/>
                </WhenConnected>
                <WhenDisconnected>
                 {content}
                </WhenDisconnected>
</div>
);
};


export default {
    title: 'setters',
    component: TestWithContentTransferForm,
  };

  

