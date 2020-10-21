import { useGlobalInputApp,createMessageConnector,decryptCodeData,mobileConnect} from 'global-input-react';
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


it("Device App and Mobile App should be able to communicate", async function () {

  const {result,waitForNextUpdate,unmount}=renderHook(()=>useGlobalInputApp({ initData }));
  
  await waitForNextUpdate();
  
  
  
  expect(result.current.isReady).toBe(true);

   const mockOnFieldChanged=jest.fn();
  result.current.setOnchange(mockOnFieldChanged);
  console.log("--------device is ready---");
  //const {findByTestId}=render(<div>{connectionMessage}</div>);  //display QR Code here
  // const {code, level,size}=await getQRCodeValues({findByTestId}); //qrcode.react module is mocked
  
  const mobileConnector=createMessageConnector();  
  const {codeData}=await decryptCodeData(result.current.connectionCode,mobileConnector); //mobile decrypt the connection
 
  const {getPermission}=await mobileConnect(mobileConnector,codeData);//mobile connect
  


  await act(async ()=>{
    const permissionMessage=await getPermission(); //wait for permission message send by the target device
    expect(permissionMessage.allow).toBeTruthy();//should allow and should contain form information
    expect(permissionMessage.initData).toBeTruthy();
    permissionMessage.initData && assertInitData(permissionMessage.initData,initData);
  });
  expect(result.current.isConnected).toBe(true);
    
  const sampleMessage={ 
          content:"User filled this content on the Global Input App",
          something:"222",
          colorCode:33
  }; 
  
  mobileConnector.sendInputMessage(sampleMessage, 0); //mobile sends information to the device
  await waitForNextUpdate();  
  expect(mockOnFieldChanged.mock.calls.length).toBe(1);  
  

  
  expect(mockOnFieldChanged.mock.calls[0][0].field.id).toBe(initData.form.fields[0].id);
  expect(mockOnFieldChanged.mock.calls[0][0].field.label).toBe(initData.form.fields[0].label);
  expect(mockOnFieldChanged.mock.calls[0][0].field.value).toEqual(sampleMessage);
  



  //await waitForNextUpdate();  
  

    unmount();

},10000);





