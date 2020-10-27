
import {generateRandomString} from "global-input-message";


test("encrypt and decrypt should work", function(){


  var uniqueValues=new Set();
  var size=1000;


  for(var i=0;i<size;i++){
       var pass=generateRandomString(17);       
       uniqueValues.add(pass);

  };
  expect(uniqueValues.size).toBe(size);




});
