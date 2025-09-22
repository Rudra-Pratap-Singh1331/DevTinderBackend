// const {calcSum} = require('./math/math.sum')
// const {sub} = require('./math/math.sub')

//centralized exported for a specific module

//static loading
// const {calcSum,sub} = require("./math")



//applicable beacuse commonjs run in non strict mode
//b=100;


//dynamic / async imports 

var a = 102 ;

var b = 90 ;

async function solve(a,b) {
    if(a===10) {
      const moduleMath = await mathModule();
      const {sub} = moduleMath
      console.log(sub(a,b))
    }else{
      console.log('not avaivle rn!')
    }
}
solve(a,b)

//----------------------------------------------===

//import { mathModule } from "./math/exporter.js";