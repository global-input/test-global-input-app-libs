import React,{useState,useEffect} from 'react';
import {useGlobalInputApp} from 'global-input-react';



export const TestWithLoginForm=()=>{
    const {username,password,setUsername,setPassword,connectionMessage,WhenConnected,WhenDisconnected,setFieldValueById}=useTestWithLoginForm();

    return(
      <>
          <div>Multiple Steps</div>
          <div>{connectionMessage}
          <WhenConnected>
              <div>Username:<input value={username} onChange={evt=>{
                  setUsername(evt.target.value);
                  setFieldValueById('username',evt.target.value);
              }}/> </div>
              <div>Password:<input value={password} onChange={evt=>{
                  setPassword(evt.target.value);
                  setFieldValueById('password', evt.target.value);
              }}/> </div>              
          </WhenConnected>
          <WhenDisconnected>
              Reload the page to try again
          </WhenDisconnected>

          
          </div>
      </>
      );
};

export default {
  title: 'SetFieldValueById',
  component: TestWithLoginForm,
};



const useTestWithLoginForm =()=>{
  
  const [username,setUsername]=useState('uu');
  const [password,setPassword]=useState('pp');

  const initData={
      action:"input",
      dataType:"form",
      form:{            
        title:"Sign In", 
        id:"###username###@global-input-app-story-test",           
        fields:[{
          label:"Username",
          id:"username",
          value:username,
          nLines:1,
          
      },{
          label:"Password",
          id:"password",
          value:password,
          nLines:1,            
      },{
        label:"Login",
        type:"button",
        id:"login"           
      }]
  }
};  

 const globalInputApp=useGlobalInputApp({initData});
 const {field, setInitData}=globalInputApp; 
  useEffect(()=>{
      if(!field){
          return;
      }
      switch(field.id){
           case 'login':
              const initData={
                  action:"input",
                  dataType:"form",
              form:{            
                title:"Sign In Complete",            
                fields:[{
                  type:"info",            
                  value:"Test Completed",                        
              }]
              }
            };          
            setInitData(initData);            
            break;
          case 'username':
              setUsername(field.value as string);
              break;
          case 'password':
              setPassword(field.value as string);
              break;    
      }
      
  },[field,setInitData]);
  return {...globalInputApp,username,password,setUsername, setPassword};

};



