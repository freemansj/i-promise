# re-promise
 A simple implementation of Promise
 
# installing
```bash
$ npm install --save r-promise
```
# How to use ?
* Just like Promise...
 Re-promise provides `.resolve`, `.reject` , `.catch`, `.then` , `.all` , `.race`;
 
* new functions: RePromise.timelimitPromise
 you can pass an executor with a limit time to timelimitPromise as argument 
 ```js
 var RP = require('r-promise');
 RP.timelimitPromise((resolve,reject){
    setTimeout(resolve,999,"done")
 },1000)
 .then(console.log,console.error); // done
 
  RP.timelimitPromise((resolve,reject){
    setTimeout(resolve,1001,"done")
 },1000)
 .then(console.log,console.error); // Timeout !!!
 
 ```


# licence
[MIT](https://tldrlegal.com/license/mit-license)
