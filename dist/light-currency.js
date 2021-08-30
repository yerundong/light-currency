"use strict";function _defineProperty(obj,key,value){if(key in obj){Object.defineProperty(obj,key,{value:value,enumerable:true,configurable:true,writable:true})}else{obj[key]=value}return obj}class Currency{constructor(value,config){const parseObj=parse(value);this.number=parseObj.number;this.value=parseObj.value;this.isNaN=parseObj.isNaN;this.config=Object.assign({},Currency.config,config)}setConfig(config){Object.assign(this.config,config);return this}setValue(value){const parseObj=parse(value);this.number=parseObj.number;this.value=parseObj.value;this.isNaN=parseObj.isNaN;return this}format(config){const config_=Object.assign({},this.config,config);const{prefix,decimalSeparator,groupSeparator,groupSize,suffix}=config_;let sign="",ev=this.value;if(/^-/.test(ev)){sign="-";ev=ev.replace(/^-/,"")}if(/\d/g.test(ev)){const arr=ev.split(".");const intStr=arr[0];const decStr=arr[1];const intArr=intStr.split("").reverse();const spArr=[];for(let i=groupSize;i<intArr.length;i+=groupSize){spArr.push(i)}for(let i=0;i<spArr.length;i++){const indx=spArr[i]+i;intArr.splice(indx,0,groupSeparator)}const intStr_=intArr.reverse().join("");if(decStr){return`${sign}${prefix}${intStr_}${decimalSeparator}${decStr}${suffix}`}else{return`${sign}${prefix}${intStr_}${suffix}`}}else{return`${sign}${prefix}${ev}${suffix}`}}static setConfig(config){Object.assign(Currency.config,config);return Currency}static getInstance(value,config){return new Currency(value,config)}static parse(value,config){return new Currency(parse(value,config).value)}static extend(name,fn){Currency.prototype[name]=function(...params){return fn.apply(this,params)}}}_defineProperty(Currency,"config",{prefix:"$",decimalSeparator:".",groupSeparator:",",groupSize:3,suffix:""});function getType(value){return Object.prototype.toString.call(value).slice(8,-1)}function isLikeNumber(value){if(!["String","Number"].includes(getType(value)))return false;if(value==="")return false;let value_=Number(value);if(Number.isNaN(value_))return false;return true}function parse(value,config){const type=getType(value);const parseObj={number:null,value:null,isNaN:null};if(type==="Number"){parseObj.number=value;if(Object.is(value,-0)){parseObj.value="-0"}else{parseObj.value=value.toString()}}else if(type==="String"){const obj=strValParse(value,config);parseObj.number=obj.number;parseObj.value=obj.value}else{parseObj.number=NaN;parseObj.value="NaN"}parseObj.isNaN=Number.isNaN(parseObj.number);return parseObj}function strValParse(value,config={}){let value_,isInfinity=/Infinity/.test(value);if(isInfinity){if(/-.*(?=Infinity)/.test(value)){return{number:-Infinity,value:"-Infinity"}}else{return{number:Infinity,value:"Infinity"}}}const ds=config.decimalSeparator||".";const reg_1=new RegExp(`[^\\d\\${ds}-]|\\${ds}(?=.*\\${ds})`,"g");const reg_2=new RegExp(`\\${ds}`,"g");value_=value.replace(reg_1,"").replace(reg_2,".");let sign=/^-/.test(value_)?"-":"";value_=value_.replace(/-/g,"");if(!isLikeNumber(value_)){return{number:NaN,value:"NaN"}}value_=value_.replace(/^0+(?=.)|\.+$/g,"").replace(/^\.+/,"0.");value_=sign+value_;return{number:Number(value_),value:value_}}module.exports=Currency;