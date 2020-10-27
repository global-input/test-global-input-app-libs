import { useGlobalInputApp, createMessageConnector,createInputReceivers} from 'global-input-react';


import { renderHook } from '@testing-library/react-hooks'

import * as testUtil from '../testUtil';

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
        receiver: createInputReceivers(deviceConfig),//message receivers on the device side      
        ui: deviceConfig.initData,
        hook:renderHook(() => useGlobalInputApp(deviceConfig)) //calls the hook
    }    
    await deviceApp.hook.waitForNextUpdate();
    expect(deviceApp.hook.result.current.isReady).toBe(true); //deviceApp is ready to accept connection from a mobile app.


    
    /** Here the device app displays a QR Code that contains the value of connectionCode, which is 
    *  an encrypted string containing information on how to connect to your device app
    **/

    const connectionCode = deviceApp.hook.result.current.connectionCode; 
    
    const mobileApp:testUtil.TestApp = {
        con: createMessageConnector(), //creates a connector
        receiver: createInputReceivers(), //create promise objects inside callbacks to make testing more intuitive.
    };
    mobileApp.message= await mobileApp.con?.connect(mobileApp.receiver.config, connectionCode); //mobile app connects to the device using the connectionCode that is obtained from the QR Code    
    mobileApp.ui = mobileApp.message.initData; //mobile app display user interface from the initData obtained
    expect(mobileApp.ui).toBeSameInitData(deviceApp.ui);//initData received by the mobile should match the one sent by the device    
    
    mobileApp.message = "content1"
    mobileApp.con?.sendValue(mobileApp.ui && mobileApp.ui.form.fields[0].id, mobileApp.message); //mobile sends a message
    deviceApp.message = deviceApp.receiver.inputs && await deviceApp.receiver.inputs[0].get();    //device receives the message
    expect(deviceApp.message).toEqual(mobileApp.message); //should match what was sent


    deviceApp.message = "content2";
    deviceApp.hook.result.current.sendValue(deviceApp.ui?.form.fields[0].id, deviceApp.message); //device app sends a message
    mobileApp.message = mobileApp.receiver.input && await mobileApp.receiver.input.get();          //mobile app receives the message
    expect(mobileApp.message.data.value).toEqual(deviceApp.message);  //received message should match what was sent
    expect(mobileApp.message.data.fieldId).toBeTruthy();
    expect(mobileApp.message.data.fieldId).toEqual(deviceApp.ui?.form.fields[0].id); //id received should match the if of the targeted field.


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
    deviceApp.receiver = createInputReceivers(deviceConfig2); //create promise objects inside callbacks to make testing more intuitive.
    deviceApp.ui = deviceConfig2.initData;

    deviceApp.hook.result.current.sendInitData(deviceApp.ui); //device app sends a new mobile user interface
    mobileApp.message = mobileApp.receiver.input && await mobileApp.receiver.input.get(); //mobile app receives the message
    mobileApp.ui = mobileApp.message.initData;   //mobile app displays a user interface from the initData received.
    expect(mobileApp.ui).toBeSameInitData(deviceApp.ui); //initData received should match what was sent

    mobileApp.message = "firstName1";
    mobileApp.con?.sendValue(mobileApp.ui?.form.fields[0].id, mobileApp.message); //mobile app sends information to the device
    deviceApp.message = deviceApp.receiver.inputs && await deviceApp.receiver.inputs[0].get(); //device app receives the message
    expect(deviceApp.message).toEqual(mobileApp.message);

    mobileApp.message = "lastName1";
    mobileApp.con?.sendValue(mobileApp.ui?.form.fields[1].id, mobileApp.message); //mobile sends information to the device
    deviceApp.message = deviceApp.receiver.inputs  && await deviceApp.receiver.inputs[1].get();
    expect(deviceApp.message).toEqual(mobileApp.message);

    mobileApp.con?.disconnect();
    deviceApp.hook.result.current.disconnect();
    deviceApp.hook.unmount();
    
});






