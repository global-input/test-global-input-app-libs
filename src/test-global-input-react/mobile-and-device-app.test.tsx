import { useGlobalInputApp,MobileState,createMessageConnector,createWaitForFieldMessages,decryptCodeData,mobileConnect} from 'global-input-react';
import {InitData} from 'global-input-react';
import { renderHook} from '@testing-library/react-hooks'


/**
   * compare initData to expectedInitData
   * @param {*} initData 
   * @param {*} expectedInitData 
   */
  const assertInitData = (initData:InitData, expectedInitData:InitData)=>{
    
    expect(initData.action).toBe(expectedInitData.action);
    expect(initData.dataType).toBe(expectedInitData.dataType);
    expect(initData.form.id).toBe(expectedInitData.form.id);
    expect(initData.form.title).toBe(expectedInitData.form.title);
    expect(initData.form.label).toBe(expectedInitData.form.label);

    initData.form.fields.forEach((field,index)=>{
        expect(expectedInitData.form.fields[index].label).toEqual(field.label);     
        expect(expectedInitData.form.fields[index].id).toEqual(field.id);
        expect(expectedInitData.form.fields[index].value).toEqual(field.value);     
        expect(expectedInitData.form.fields[index].nLines).toBe(field.nLines);     
      });

  };






it("Device App and Mobile App should be able to communicate", async function () {

 const initData={
   action: "input",
   dataType: "form",
   form: {
     id: "test@globalinput.co.uk",
     title: "Global Input App Test",
     label: "Global Input Test",
     fields: [
       {
         label: "Content",
         id: "content",
         value: "",
         nLines: 10,                
       }
     ]
   }
  };
  let fields=createWaitForFieldMessages(initData.form.fields);
  const {result,waitForNextUpdate,unmount}=renderHook(()=>useGlobalInputApp({ initData }));
  await waitForNextUpdate();
  expect(result.current.mobileState).toBe(MobileState.WAITING_FOR_MOBILE);
  
  //const {findByTestId}=render(<div>{connectionMessage}</div>);  //display QR Code here
  // const {code, level,size}=await getQRCodeValues({findByTestId}); //qrcode.react module is mocked
  
  const mobileConnector=createMessageConnector();  
  const {codeData}=await decryptCodeData(result.current.connectionCode,mobileConnector); //mobile decrypt the connection
 
  const {getPermission,input}=await mobileConnect(mobileConnector,codeData);//mobile connect
  
  
  const permissionMessage=await getPermission(); //wait for permission message send by the target device
  expect(permissionMessage.allow).toBeTruthy();//should allow and should contain form information
  expect(permissionMessage.initData).toBeTruthy()
  permissionMessage.initData && assertInitData(permissionMessage.initData,initData);
  
  const sampleMessage={ 
          content:"User filled this content on the Global Input App",
          something:"222",
          colorCode:33
  }; 
  mobileConnector.sendInputMessage(sampleMessage, 0); //mobile sends information to the device
  const messageReceived= await fields[0].get();    
  expect(messageReceived).toEqual(sampleMessage);
  fields[0].reset();

  const contentSendByDevice="send by device app";
  result.current.setFieldValueById(initData.form.fields[0].id,contentSendByDevice);
  const inputMessageOnMobile=await input.get();
  expect(inputMessageOnMobile.data.value).toEqual(contentSendByDevice);
  expect(inputMessageOnMobile.data.index).toEqual(0);
  input.reset();

  const initData2={
        action: "input",
        dataType: "form",
        form: {
        id: "test2@globalinput.co.uk",
        title: "Global Input App Test 2",
        label: "Global Input Test 2",
        fields: [
            {
                label: "First Name",
                id: "firstName",
                value: "",
                nLines: 10
            },{
                label: "Last Name",
                id: "lastName",
                value: "",
                nLines: 10                
            },
        ]
        }
    };
    fields=createWaitForFieldMessages(initData2.form.fields);
    result.current.setInitData(initData2);
    const initDataMessage=await input.get();    

    initDataMessage.initData && assertInitData(initDataMessage.initData,initData2);

    const firstName="dilshat";
    const lastName="hewzulla";
    
    mobileConnector.sendInputMessage(firstName, 0); //mobile sends information to the device
    const firstNameReceived= await fields[0].get();
    expect(firstNameReceived).toEqual(firstName);
    fields[0].reset();


    mobileConnector.sendInputMessage(lastName, 1); //mobile sends information to the device
    const lastNameReceived= await fields[1].get();
    expect(lastNameReceived).toEqual(lastName);
    fields[1].reset();
    mobileConnector.disconnect();  
    unmount();

});





