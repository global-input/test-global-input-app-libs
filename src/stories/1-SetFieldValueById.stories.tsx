import React, { useState} from 'react';
import { useGlobalInputApp, ConnectQR } from 'global-input-react';

const usernameField={
  id: "username",
  label: "Username"
};

const passwordField={
  id: "password",
  label: "Password"
};
const loginButton={
  id: "login",
  label: "Login",
  type: "button",
}
const loginInitData = {
  id:"login",
  action: "input",
  dataType: "form",
  form: {
    title: "Sign In",
    id: "###username###@global-input-app-story-test",
    fields: [usernameField,passwordField,loginButton]
  }
};

const completedInitData = {
  id:"completed",
  action: "input",
  dataType: "form",
  form: {
    title: "Sign In Complete",
    fields: [{
      type: "info",
      value: "Test Completed",
    }]
  }
};



export const TestWithLoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [page,setPage] =useState(1);
  const mobile = useGlobalInputApp({ initData: loginInitData });
  mobile.setOnchange(({ field,sendInitData}) => {
    const {id,value} = field;

    switch (id) {
      case usernameField.id:
        setUsername(value as string);
        break;
      case passwordField.id:
        setPassword(value as string);
        break;
      case loginButton.id:
        sendInitData(completedInitData);
        setPage(2);
        break;
    }
  });


  return (
    <>
      <ConnectQR mobile={mobile}/>
      <div>Multiple Steps</div>
      {page===1 && (<>
              <div>Username:<input value={username} onChange={evt => {
                setUsername(evt.target.value);
                mobile.sendValue(usernameField.id, evt.target.value);}}/>
              </div>
              <div>Password:<input value={password} onChange={evt=>{
                                setPassword(evt.target.value);
                                mobile.sendValue(passwordField.id, evt.target.value);}}/>
              </div>
          </>)}
       {page ===2 &&
         <div>Login Completed</div>
       }
    </>
  );

};






export default {
  title: 'SetFieldValueById',
  component: TestWithLoginForm
};
