import { useGlobalInputApp,MobileState,createMessageConnector,createWaitForFieldMessages,decryptCodeData,mobileConnect} from 'global-input-react';
import {InitData} from 'global-input-react';
import { renderHook,act} from '@testing-library/react-hooks'


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

/**
   * The data that defines first ui
   * 
   */

   const testData = [{
        initData:{
            action: "input",
            dataType: "form",
            form: {
                id: "test@globalinput.co.uk",
                title: "Global Input App Test",
                label: "Global Input Test",
                fields: [{
                  label: "Content",
                  id: "content",
                  value: "",
                  nLines: 10,                
                }]
              }
        
        },
        sentByMobile:{
          content:"User filled this content on the Global Input App",
          something:"222",
          colorCode:33
        },
        sentByDevice:"send by device app"
      },{
          initData:{
            action: "input",
            dataType: "form",
            form: {
            id: "test2@globalinput.co.uk",
            title: "Global Input App Test 2",
            label: "Global Input Test 2",
            fields: [{
                      label: "First Name",
                      id: "firstName",
                      value: "",
                      nLines: 10
                    },{
                      label: "Last Name",
                      id: "lastName",
                      value: "",
                      nLines: 10                
                     }]
            }
          },
          firstNameSentByMobile:{ 
            value:"dilshatMobile"
          },
          lastNameSentByMobile:{ 
            value:"hewzullaMobile"
          },
          firstNameSentByDevice:{ 
            value:"dilshatMobile"
          },
          lastNameSentByDevice:{ 
            value:"hewzullaMobile"
          }

      }];
  
it("Device App and Mobile App should be able to communicate", async function () {

 
  /**
   * Device should get ready for a mobile to connect
   */
  let fieldMessages=createWaitForFieldMessages(testData[0].initData.form.fields); //create promises to wait for messages
  const {result,waitForNextUpdate,unmount}=renderHook(()=>useGlobalInputApp({ initData:testData[0].initData }));
  await waitForNextUpdate();  
  expect(result.current.mobileState).toBe(MobileState.WAITING_FOR_MOBILE); //now ready for mobile to connect
  

  /**
   * A mobile should be able to obtain the codeData that contains information how to connect to the device   
   */
  const mobileConnector=createMessageConnector();  //mobile app starts up
  const {codeData}=await decryptCodeData(result.current.connectionCode,mobileConnector); //mobile decrypt the connection

  /**
   * The mobile should be able to connect to the device securely and 
   * the permission information it received should contain a user interface data that matches the one set on the device side.
   * The device should be in connected state when a mobile is connected
   */
  const {getPermission,input:mobileInput}=await mobileConnect(mobileConnector,codeData);//mobile connect to the device
  await act(async ()=>{
    const permissionMessage=await getPermission(); //wait for permission message send by the target device
    expect(permissionMessage.allow).toBeTruthy();//should allow and should contain form information
    expect(permissionMessage.initData).toBeTruthy();//should contain the initData which contains the data to tell mobile to compose an user interface
    permissionMessage.initData && assertInitData(permissionMessage.initData,testData[0].initData); //the initData received should be identical to the one sent by the device 
  });
  expect(result.current.mobileState).toBe(MobileState.MOBILE_CONNECTED); //mobile is now connected to the device
    
  /**
   * Now mobile should be able sends data
   * The device should be able to receive the data
   */     
  mobileConnector.sendInputMessage(testData[0].sentByMobile, 0); //mobile sends data to the device
  const contentReceivedByDevice= await fieldMessages[0].get();    //device receive the data
  fieldMessages[0].reset(); //device ready for the next message
  expect(contentReceivedByDevice).toEqual(testData[0].sentByMobile); //received data should be identical to the one sent  
  
/**
   * Now device should be able sends data
   * The mobile should be able to receive the data
   */       
  await act(async ()=>{
    result.current.setFieldValueById(testData[0].initData.form.fields[0].id,testData[0].sentByDevice); //device sends data
    const inputMessage=await mobileInput.get(); //mobile receives the data
    mobileInput.reset(); //mobile ready for the next message
    expect(inputMessage.data.value).toEqual(testData[0].sentByDevice); // should be identical to the data sent by device
    expect(inputMessage.data.index).toEqual(0);  //and it should be the first in the form fields.
  });
  
  
/**
   * The device sends a new user interface data.
   * The mobile should be able to receive the data correctly.
   * From now on, the device and the mobile interoperate with the new user interface data
   */       


    fieldMessages=createWaitForFieldMessages(testData[1].initData.form.fields);
    await act(async ()=>{
      result.current.setInitData(testData[1].initData);
      const inputMessage=await mobileInput.get(); //mobile receives the message
      mobileInput.reset(); //mobile ready for the next message      
      inputMessage.initData && assertInitData(inputMessage.initData,testData[1].initData);      
    });

    /**   
   * The mobile sends first name to device
   * The device should be able to receive the data correctly
   */       

    
    mobileConnector.sendInputMessage(testData[1].firstNameSentByMobile, 0); //mobile sends data to the device
    const firstNameReceivedByDevice= await fieldMessages[0].get();    //device receives data
    fieldMessages[0].reset(); //device ready for the next message
    expect(firstNameReceivedByDevice).toEqual(testData[1].firstNameSentByMobile); //The received data should match the one sent by the mobile 
    
    /**   
   * The mobile sends last name to device
   * The device should be able to receive the data correctly
   */
    mobileConnector.sendInputMessage(testData[1].lastNameSentByMobile, 1); //mobile sends data to the device
    const lastNameFromMobileOnDevice= await fieldMessages[1].get();
    fieldMessages[1].reset();    
    expect(lastNameFromMobileOnDevice).toEqual(testData[1].lastNameSentByMobile); //The received data should match the one sent by the mobile    
    

    /**   
   * The device sends first name to mobile
   * The mobile should be able to receive the data correctly
   */

  await act(async ()=>{
    result.current.setFieldValueById(testData[1].initData.form.fields[0].id,testData[1].firstNameSentByDevice); //device sends a message
    const inputMessage=await mobileInput.get(); //mobile receives the message
    mobileInput.reset(); //mobile ready for the next message
    expect(inputMessage.data.value).toEqual(testData[1].firstNameSentByDevice); //mobile should receive the same message sent by device
    expect(inputMessage.data.index).toEqual(0);  //and index of the message should be correct.
  });
  /**   
   * The device sends first name to mobile
   * The mobile should be able to receive the data correctly
   */

  await act(async ()=>{
    result.current.setFieldValueById(testData[1].initData.form.fields[1].id,testData[1].lastNameSentByDevice); //device sends a message
    const inputMessage=await mobileInput.get(); //mobile receives the message
    mobileInput.reset(); //mobile ready for the next message
    expect(inputMessage.data.value).toEqual(testData[1].lastNameSentByDevice); //mobile should receive the same message sent by device
    expect(inputMessage.data.index).toEqual(1);  //and index of the message should be correct.
  });

    
});





