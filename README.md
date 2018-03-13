# re-promise
 A simple implementation of Promise
 
# installing
```bash
$ npm install --save r-promise
```
# How to use ?
* Just like Promise...
 Re-promise provides `.resolve`, `.reject` , `.catch`, `.then` , `.all` , `.race`;
 
* new functions: RePromise.timelimit
 you can pass an executor with a limit time to `.timelimit` as argument 
 ```js
 var RP = require('r-promise');
 RP.timelimit((resolve,reject){
    setTimeout(resolve,1000,"done")
 },1001)
 .then(console.log,console.error); // done
 
  RP.timelimit((resolve,reject){
    setTimeout(resolve,1000,"done")
 },999)
 .then(console.log,console.error); // Timeout !!!
 
 ```


# licence
[MIT](https://tldrlegal.com/license/mit-license)
