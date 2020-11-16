import { useGlobalInputApp, createMessageConnector } from 'global-input-react';
import { renderHook, act } from '@testing-library/react-hooks'

import * as testUtil from '../test-util';
expect.extend({ toBeSameInitData: testUtil.toBeSameInitData });


it("Device App uses a listener to communicate with mobile app", async function () {

  const deviceConfig = {
    initData: {
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
    }
  };



  const deviceApp: testUtil.TestAppReact2 = {
    ui: deviceConfig.initData,
    hook: renderHook(() => useGlobalInputApp(deviceConfig)), //calls the hook
    listener: jest.fn(), //mock callback function for receiving mobile input events;
    calls: []
  }

  await deviceApp.hook.waitForNextUpdate();
  expect(deviceApp.hook.result.current.isReady).toBe(true); //deviceApp is ready to accept connection from a mobile app.


  deviceApp.hook.result.current.setOnchange(deviceApp.listener); //set the listener to receive mobile events;


  /** Here the device app displays a QR Code that contains the value of connectionCode, which is
    *  an encrypted string containing information on how to connect to your device app
    **/

  const connectionCode = deviceApp.hook.result.current.connectionCode;

  const mobileApp: testUtil.TestApp = {
    con: createMessageConnector(), //creates a connector
    receiver: testUtil.createInputReceivers(), //create promise objects inside callbacks to make testing more intuitive.
    ui: null
  };
  await act(async () => {
    mobileApp.message = await mobileApp.con.connect(mobileApp.receiver.config, connectionCode); //mobile app connects to the device using the connectionCode that is obtained from the QR Code
  });
  mobileApp.ui = mobileApp.message.initData; //mobile app display user interface from the initData obtained
  expect(mobileApp.ui).toBeSameInitData(deviceApp.ui);//initData received by the mobile should match the one sent by the device

  mobileApp.message = "content1"
  await act(async () => {
    expect(mobileApp.ui).toBeTruthy();
    mobileApp.con.sendValue(mobileApp.ui && mobileApp.ui.form.fields[0].id, mobileApp.message); //mobile sends a message
  });
  await deviceApp.hook.waitForNextUpdate();

  expect(deviceApp.listener.mock.calls.length).toBe(1);
  deviceApp.calls = deviceApp.listener.mock.calls[0];
  expect(deviceApp.calls[0].field.id).toEqual(deviceApp.ui.form.fields[0].id);
  expect(deviceApp.calls[0].field.label).toEqual(deviceApp.ui.form.fields[0].label);
  expect(deviceApp.calls[0].field.value).toEqual(mobileApp.message);


  mobileApp.message = "content2";
  await act(async () => {
    expect(mobileApp.ui).toBeTruthy();
    mobileApp.con.sendValue(mobileApp.ui && mobileApp.ui.form.fields[0].id, mobileApp.message); //mobile sends a message
  });
  await deviceApp.hook.waitForNextUpdate();

  expect(deviceApp.listener.mock.calls.length).toBe(2);
  deviceApp.calls = deviceApp.listener.mock.calls[1];
  expect(deviceApp.calls[0].field.id).toEqual(deviceApp.ui.form.fields[0].id);
  expect(deviceApp.calls[0].field.label).toEqual(deviceApp.ui.form.fields[0].label);
  expect(deviceApp.calls[0].field.value).toEqual(mobileApp.message);

  deviceApp.hook.unmount();

}, 10000);
