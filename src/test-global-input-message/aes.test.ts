import {decrypt,encrypt,generateRandomString} from "global-input-message";


test("encrypt and decrypt should work", function(){
  

   for(let i=0;i<10;i++){
             const codedata={
                       url:"https://globalinput.co.uk",
                       session:generateRandomString(17),
                       action:"input",
                       aes:generateRandomString(17)
             };
             const codeAES=generateRandomString(17);

             const codeString=JSON.stringify(codedata);
             const encryptedValue="A"+encrypt("J"+codeString,codeAES);            
             const decrypted=decrypt(encryptedValue.substring(1),codeAES);
             
             const obj=JSON.parse(decrypted.substring(1));
             expect(obj.url).toBe(codedata.url);
             expect(obj.session).toBe(codedata.session);
             expect(obj.action).toBe(codedata.action);
             expect(obj.aes).toBe(codedata.aes);
   }






});
