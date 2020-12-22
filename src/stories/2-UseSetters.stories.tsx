import React, {useState} from 'react';
import {useGlobalInputApp,ConnectQR} from 'global-input-react';

const contentField={
  label:"Content",
  id:"content",
  value:"",
  nLines:10
}

const initData={
  action:"input",
  dataType:"form",
  form:{
    title:"Content Transfer",
    fields:[contentField]
  }
};
export const TestWithContentTransferForm=()=>{

const [content,setContent]=useState('');
let mobile=useGlobalInputApp({initData});
mobile.setOnchange(({field})=>{
      setContent(field.value as string);
});

return(
    <div>
      <div>Test Input</div>
       <ConnectQR mobile={mobile}/>
       {mobile.isConnected && (

                        <textarea style={{width:500, height:500}} value={content as string} onChange={evt => {
                            setContent(evt.target.value);
                            mobile.sendValue(contentField.id,evt.target.value);
                        }}/>
        )}
        {mobile.isDisconnected && (
                <>
                 <div>{content}</div>
                 <div>disconnected</div>
                </>
        )}

</div>
);
};


export default {
    title: 'setters',
    component: TestWithContentTransferForm,
  };
