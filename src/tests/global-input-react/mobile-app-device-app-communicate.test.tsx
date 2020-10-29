import { useGlobalInputApp, createMessageConnector} from 'global-input-react';


import { renderHook,act } from '@testing-library/react-hooks'

import * as testUtil from '../test-util';

expect.extend({toBeSameInitData:testUtil.toBeSameInitData});

it("Device App and Mobile App should be able to communicate", async function () {

    const deviceConfig = {
        initData: {
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
        }
    };
    
    const deviceApp:testUtil.TestAppReact = {
        receiver: testUtil.createInputReceivers(deviceConfig),//message receivers on the device side              
        hook:renderHook(() => useGlobalInputApp(deviceConfig)), //calls the hook
        ui: deviceConfig.initData //ui that is going to be sent to the mobile app.
    }   
    
    await deviceApp.hook.waitForNextUpdate();
    expect(deviceApp.hook.result.current.isReady).toBe(true); //deviceApp is ready to accept connection from a mobile app.


    
    /** Here the device app displays a QR Code that contains the value of connectionCode, which is 
    *  an encrypted string containing information on how to connect to your device app
    **/

    const connectionCode = deviceApp.hook.result.current.connectionCode; 
    
    const mobileApp:testUtil.TestApp = {
        con: createMessageConnector(), //creates a connector
        receiver: testUtil.createInputReceivers(), //create promise objects inside callbacks to make testing more intuitive.
        ui:null                                    //going to be set when received from the device app
    };
    await act(async ()=>{
        mobileApp.message=  await mobileApp.con.connect(mobileApp.receiver.config, connectionCode); //mobile app connects to the device using the connectionCode that is obtained from the QR Code
    });
    expect(mobileApp.message).toBeTruthy();
    mobileApp.ui = mobileApp.message.initData; //mobile app display user interface from the initData obtained
    expect(mobileApp.ui).toBeSameInitData(deviceApp.ui);//initData received by the mobile should match the one sent by the device    
    
    mobileApp.message = "content1"
    expect(mobileApp.ui).toBeTruthy(); //ui should be received 
    await act(async ()=>{
        mobileApp.con.sendValue(mobileApp.ui?.form.fields[0].id, mobileApp.message); //mobile sends a message
    });
    deviceApp.message = deviceApp.receiver.inputs && await deviceApp.receiver.inputs[0].get();    //device receives the message
    expect(deviceApp.message).toEqual(mobileApp.message); //should match what was sent


    deviceApp.message = "content2";
    await act(async ()=>{
    deviceApp.hook.result.current.sendValue(deviceApp.ui.form.fields[0].id, deviceApp.message); //device app sends a message
    });    
    mobileApp.message = mobileApp.receiver.input && await mobileApp.receiver.input.get(); //mobile app receives the message    
    expect(mobileApp.message.data.value).toEqual(deviceApp.message);  //received message should match what was sent
    expect(mobileApp.message.data.fieldId).toBeTruthy();
    expect(mobileApp.message.data.fieldId).toEqual(deviceApp.ui.form.fields[0].id); //id received should match the if of the targeted field.


    const deviceConfig2 = {
        initData: {
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
                    }, {
                        label: "Last Name",
                        id: "lastName",
                        value: "",
                        nLines: 10
                    },
                ]
            }
        }
    };
    deviceApp.receiver = testUtil.createInputReceivers(deviceConfig2); //create promise objects inside callbacks to make testing more intuitive.
    deviceApp.ui = deviceConfig2.initData;
    await(act(async ()=>{
        deviceApp.hook.result.current.sendInitData(deviceApp.ui); //device app sends a new mobile user interface
    }));
    expect(mobileApp.receiver.input).toBeTruthy();
    mobileApp.message = mobileApp.receiver.input && await mobileApp.receiver.input.get(); //mobile app receives the message
    mobileApp.ui = mobileApp.message.initData;   //mobile app displays a user interface from the initData received.
    expect(mobileApp.ui).toBeSameInitData(deviceApp.ui); //initData received should match what was sent

    mobileApp.message = "firstName1";
    await act(async ()=>{
        expect(mobileApp.receiver.input).toBeTruthy();
        mobileApp.con.sendValue(mobileApp.ui?.form.fields[0].id, mobileApp.message); //mobile app sends information to the device
    });
    expect(deviceApp.receiver.inputs).toBeTruthy();
    deviceApp.message = deviceApp.receiver.inputs && await deviceApp.receiver.inputs[0].get(); //device app receives the message
    expect(deviceApp.message).toEqual(mobileApp.message);

    mobileApp.message = "lastName1";
    mobileApp.con.sendValue(mobileApp.ui?.form.fields[1].id, mobileApp.message); //mobile sends information to the device
    expect(deviceApp.receiver.inputs).toBeTruthy();
    deviceApp.message = deviceApp.receiver.inputs  && await deviceApp.receiver.inputs[1].get();
    expect(deviceApp.message).toEqual(mobileApp.message);
    await act(async ()=>{
    mobileApp.con.disconnect();
    deviceApp.hook.result.current.disconnect();
    });
    deviceApp.hook.unmount();

    
});






