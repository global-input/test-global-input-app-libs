import React from 'react';

export default ({value,level,size})=>{
    console.log("-----------:mock is called--------");
    return(
    <div data-testid="qrcode">
      <div data-testid="level">{level}</div>
      <div data-testid="size">{size}</div>
      <div data-testid="code">{value}</div>      
    </div>
      );
};

export const getQRCodeValues=async ({findByTestId})=>{
    const size=(await findByTestId('size')).textContent;
    const level=(await findByTestId('level')).textContent;
    const code=(await findByTestId('code')).textContent; //Mocked qrcode.react will display code as text instead of QR Code
    return {
        level,
        code,
        size
    }
};

