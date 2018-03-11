

class IPromise {
	constructor(executor){
		if(!isFunc(executor)) throw new TypeError("You should pass a function as the first argument to the promise constructor !");
		this.status = 'pending';
		this.tasks = {
			fulfilled:[],
			rejected:[]
		};
		executor(dispatch.bind(this,'fulfilled'),dispatch.bind(this,'rejected'));//synchronize

		function dispatch(curri_status,value){
			if(this.status !== 'pending')
				return;
			this.status = curri_status;
			this.value = value;
			let t;
			while(t = this.tasks[curri_status].shift()){
				t.call(this,value);
			}
		}
	}

	then(res,rej){
		return new IPromise((actRes,actRej)=>{ // new executor(resolve,reject)
			function factory(fn,type){
				return (val)=>{
					if(!isFunc(fn)) return type==='resolve'?
						setTimeout(actRes,0,val):setTimeout(actRej,0,val);
					try{
						let fn_result = fn(val);
						if(isThenable(fn_result))
							fn_result.then(actRes,actRej);
						else setTimeout(actRes,0,fn_result);
					}
					catch(e){
						setTimeout(actRej,0,e);
					}
				};
			}
			switch(this.status){
				case 'pending': 
					this.tasks['fulfilled'].push(factory(res,'resolve'));
					this.tasks['rejected'].push(factory(rej,'reject'));
					break;
				case 'fulfilled' : factory(res,'resolve')(this.value) ; break;
				case 'rejected' :factory(rej,'reject')(this.value) ; break;
				/*case 'fulfilled' :setTimeout(factory(res,'resolve'), 0 ,this.value ); break;
				case 'rejected' :setTimeout(factory(rej,'reject'),0, this.value) ; break;*/
			}
		});

	}

	catch(rej){
		return this.then(null,rej);
	}

	static resolve(val){
		return new IPromise((res)=>{res(val)});
	}
	static reject(e){
		return new IPromise((_,rej)=>{rej(e)});
	}

	static all(arrayOfPs){
		if(!Array.isArray(arrayOfPs)) throw new TypeError("You should pass an array-obj to IPromise.all as argument");
		return new IPromise((actRes,actRej)=>{
			let result= [];
			let resolved = 0;
			let breakFlag = false; //the flag to break from Array.some
			arrayOfPs.some((ps,idx)=>{ // once any promise in arrayOfPs rejected  , 'Reject' immediately
				ps.then((v)=>{
					result[idx] = v;
					if(++resolved >= arrayOfPs.length) actRes(result); 
					/*till all promise in arrayOfPs resolved, 
					 * return result-array[ should keep the original order]
					 */
				});
				ps.catch((e)=>{ 
					actRej(e);
					breakFlag = true;
				});
				if(breakFlag)
					return false;
				console.log("running "+ idx);
			});
		});
	}

	static race(arrayOfPs){
		if(!Array.isArray(arrayOfPs)) throw new TypeError("You should pass an array-obj to IPromise.all as argument");
		return new IPromise((actRes,actRej)=>{
			let mutex = 1;
			arrayOfPs.some((ps,idx)=>{
				ps.then((v)=>{
					if( mutex--){
						actRes(v);
					}
				});
				ps.catch((e)=>{actRej(e)});
				if(mutex<1)
					return false;
			});
		});
	}	

}

function isFunc(fn){
	return typeof fn === 'function';
}

function isThenable(fn){
	return fn && isFunc(fn.then);
}

module.exports = IPromise;