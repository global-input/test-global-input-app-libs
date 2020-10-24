import { createMessageConnector, createInputReceivers} from "global-input-message"; 



import {InitData} from 'global-input-message'; //import types

  /**
   * compare initData to expectedInitData
   * @param {*} initData 
   * @param {*} expectedInitData 
   */
  const assertInitData = (initData?:InitData, expectedInitData:InitData)=>{
    if(!initData){
      throw new Error("initData is missing");
    }
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

  describe("Mobile and Device Communication",()=>{

    test('receiver sender should send input message', async () => {


      
            
      
          
      const deviceConfig = {
        //url: 'http://localhost:1337',
        // cSpell:disable
        //apikey: "k7jc3QcMPKEXGW5UC",
        // cSpell:enable     
        initData:{
          action: "input",    
          dataType: "form",        
          form: {
            title: "Login",
            id:"someForm",
            label:"someFolder",
            fields: [{
              label: "Email address",
              value: "some value"
            }, {
              label: "Password",
              type: "secret"
            }, {
              label: "Login",
              type: "action"
            }]
          }
        }
      };
    
      
      const deviceConnector = createMessageConnector(); 
      let deviceData=createInputReceivers(deviceConfig);  //set up message receivers on the device    
      const {connectionCode}=await deviceConnector.connect(deviceConfig); //device app starts up and obtains the connection code.
      
      

      const mobileConnector = createMessageConnector(); 
      const mobileData=createInputReceivers();
      const {initData}=await mobileConnector.connect(mobileData.config,connectionCode);
      assertInitData(initData,deviceConfig.initData);
      
    
      const messageSentByMobile = { content: "dilshat" };
      mobileConnector.sendInputMessage(messageSentByMobile, 0); //mobile  sends the first message, and the device receives it
      const messageReceivedByDevice = deviceData.inputs && await deviceData.inputs[0].get(); //device receives the message

      expect(messageReceivedByDevice).toEqual(messageSentByMobile);
      
    
      const message2SentByMobile = { content: "password111" };
      mobileConnector.sendInputMessage(message2SentByMobile, 1); //mobile  sends the second message, and the device receives it
      const message2ReceivedByDevice = deviceData.inputs && await deviceData.inputs[1].get(); //device receives the message
      expect(message2ReceivedByDevice).toEqual(message2SentByMobile);
      
      const messageSentByDevice={content:"some value"};
      deviceConnector.sendInputMessage(messageSentByDevice,0); //device sends first message
      const messageReceivedByMobile=mobileData.input && await mobileData.input.get();   //mobile receives the message 
      expect(messageReceivedByMobile && messageReceivedByMobile.data.index).toEqual(0);
      expect(messageReceivedByMobile && messageReceivedByMobile.data.value).toEqual(messageSentByDevice);
      

      const message2SentByDevice={content:"some value 2"};
      deviceConnector.sendInputMessage(message2SentByDevice,1); //device sends the first message, and the mobile receives it
      const message2ReceivedByMobile=mobileData.input && await mobileData.input.get();   //mobile receives the message 
      expect(message2ReceivedByMobile && message2ReceivedByMobile.data.index).toEqual(1);
      expect(message2ReceivedByMobile && message2ReceivedByMobile.data.value).toEqual(message2SentByDevice);
      const deviceConfig2 = {
            initData:{
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
        }
      };
      deviceData=createInputReceivers(deviceConfig2);
      deviceConnector.sendInitData(deviceConfig2.initData); //device sent initData
      const messageForInitData=mobileData.input && await mobileData.input.get(); //mobile receives the initData      
      expect(messageForInitData && messageForInitData.initData).toBeTruthy();
      messageForInitData && assertInitData(messageForInitData.initData,deviceConfig2.initData); //received should match what is sent
      
      const message3SentByMobile = { firstName: "dilshat" };
      mobileConnector.sendInputMessage(message3SentByMobile,0);        //mobile sends a message
      const message3ReceivedByDevice = deviceData.inputs && await deviceData.inputs[0].get();  //device receives it
      expect(message3ReceivedByDevice).toEqual(message3SentByMobile);
   
      const message4SentByMobile = { lastName: "hewzulla" };
      mobileConnector.sendInputMessage(message4SentByMobile,1); //mobile sends a message
      const message4ReceivedByDevice = deviceData.inputs && await deviceData.inputs[1].get();  //device receives it
      expect(message4ReceivedByDevice).toEqual(message4SentByMobile);
       
      const message3SentByDevice={firstName: "name1"};            
      deviceConnector.sendInputMessage(message3SentByDevice,0); //device sends the first message, and the mobile receives it      
      const messageReceived7ByMobile=mobileData.input && await mobileData.input.get();  
      expect(messageReceived7ByMobile && messageReceived7ByMobile.data.index).toEqual(0);
      expect(messageReceived7ByMobile && messageReceived7ByMobile.data.value).toEqual(message3SentByDevice);
   
      mobileConnector.disconnect();
      deviceConnector.disconnect();
    
  });

    test('receiver sender should pairing', async () => {
      
      const deviceConfig={
        url:'https://globalinput.co.uk',
        // cSpell:disable      
        securityGroup:"KqfMZzevq2jCbQUg+W8i750",        
        apikey:"k7jc3QcMPKEXGW5UC",
        // cSpell:enable              
        initData:{
          action:"input",
          form:{
                 title:"Login",
                    fields:[{
                  label:"Email address",
                  value:"some value"
                  },{
                    label:"Password",
                   type:"secret"
                  },{
                    label:"Login",
                   type:"action"
                 }]
            }
      }
    }
    
      const codeAES = "YFd9o8glRNIvM0C2yU8p4";
      const deviceConnector=createMessageConnector();
      deviceConnector.setCodeAES(codeAES);
      
      let deviceData = createInputReceivers(deviceConfig);
      const connectCode=await deviceConnector.connect(deviceConfig);  //connect
      const encryptedDevicePairingCodeData=deviceConnector.buildPairingData(); //get pairing code from the device

      const mobileConnector=createMessageConnector(); //mobile app

      let mobileData=createInputReceivers();
      const {codeData}=await mobileConnector.connect(mobileData.config,encryptedDevicePairingCodeData); //expected to get the codeData for pairing      
      expect(codeData).toEqual({
        securityGroup:deviceConfig.securityGroup,
        codeAES,
        action:"pairing"
      });
      
      expect(codeData && codeData.codeAES).toBeTruthy();
      expect(codeData && codeData.securityGroup).toBeTruthy();
      codeData && codeData.codeAES && mobileConnector.setCodeAES(codeData.codeAES);   //pair the mobile with the data
      codeData && codeData.securityGroup && mobileConnector.setSecurityGroup(codeData.securityGroup); //pair the mobile with the data
      const inputCodeData=deviceConnector.buildInputCodeData(); //get the connectionCode
    
      const {initData}=await mobileConnector.connect(mobileData.config,inputCodeData); //connect to the device using the code
      assertInitData(initData,deviceConfig.initData);  //should get the initData from the device

            
    const messageSentByMobile={content:"dilshat"};    
    mobileConnector.sendInputMessage(messageSentByMobile, 0); //message send by mobile should be received by device
    const messageReceivedByDevice=deviceData.inputs && await deviceData.inputs[0].get();
    expect(messageReceivedByDevice).toEqual(messageSentByMobile);
    
    const messageSentByDevice={content:"next content"};    
    deviceConnector.sendInputMessage(messageSentByDevice,0);
    const messageReceivedByMobile=mobileData.input && await mobileData.input.get();
    
    expect(messageReceivedByMobile && messageReceivedByMobile.data.index).toEqual(0);
    expect(messageReceivedByMobile && messageReceivedByMobile.data.value).toEqual(messageSentByDevice);
    
    mobileConnector.disconnect();
    deviceConnector.disconnect();
    
    },10000);


  });




