// // console.log(x); // Output: undefined
// // var x = 5;

// // console.log(y); // Output: ReferenceError: Cannot access 'y' before initialization
// // let y = 10;

// // myFunction(); // Output: "Hello!"
// // function myFunction() {
// //   console.log("Hello!");
// // }

// // myExpression(); // Output: TypeError: myExpression is not a function
// // let myExpression = function() {
// //   console.log("Hi!");
// // };


//  x = 90
// // function testVarScope() {
// //     x=8
// //     console.log(x)
// //     if (true) {
// //        x = 10;
// //     }
// //     console.log(x); // ✅ 10 — accessible outside the block
// //   }
  
//   // testVarScope();
  
//   function outerFun(a) {
//     function innerFun(b) {
//         return a + b;
//     }
//     return innerFun;
// }

// const addTen = outerFun(10);
// // console.log(addTen(5));Output: 8


// // Function calling
// welcome();

// console.log(A)  //why th avalue of A is not 9
// var A =9
// function welcome() {
//    A =90
// console.log(A)

//   console.log("welcome to GfG");
// }

// //callin function 1. welcome()->print 90->undefined because var is hoisting on top 



// let a = [2,2,4,6]

// // let b = 0
// // for(let i =0 ;i<a.length; i++){
// //    b = b+a[i]


// // }
// // console.log(b,"b")

// const AB = [10, 20, 30, 40];  // example array

// let key = 30
// for (let i = AB.length; i >= 0; i--) {
//   if(key ==AB[i]){
//     AB[i] =(56)

//   }
//   AB.push(0)
//   console.log(AB[i]);
// }




let a1 = [2,4,6,7]
let b1 = [2,3,5,6,7]

for(let i= 0;i<a1.length;i++){
  console.log(a1[i]+b1[i])
}