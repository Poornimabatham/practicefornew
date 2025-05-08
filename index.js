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
// // //     console.log(x)
// // //     if (true) {
// // //        x = 10;
// // //     }
// // //     console.log(x); // ✅ 10 — accessible outside the block
// // //   }
  
// //   // testVarScope();
  
// //   function outerFun(a) {
// //     function innerFun(b) {
// //         return a + b;
// //     }
// //     return innerFun;
// // }

// // const addTen = outerFun(10);
// // // console.log(addTen(5));Output: 8


// // // Function calling
// // welcome();

// // console.log(A)  //why th avalue of A is not 9
// // var A =9
// // function welcome() {
// //    A =90
// // console.log(A)

// //   console.log("welcome to GfG");
// // }

// // //callin function 1. welcome()->print 90->undefined because var is hoisting on top 



// // let a = [2,2,4,6]

// // // let b = 0
// // // for(let i =0 ;i<a.length; i++){
// // //    b = b+a[i]


// // // }
// // // console.log(b,"b")

// // // const AB = [10, 20, 30, 40];  // example array

// // // let key = 30
// // // for (let i = AB.length; i >= 0; i--) {
// // //   if(key ==AB[i]){
// // //     AB[i] =(56)

// // //   }
// // //   AB.push(0)
// // //   console.log(AB[i]);
// // // }




// // let a1 = [2,4,6,7]
// // let b1 = [2,3,5,6,7]

// // for(let i= 0;i<a1.length;i++){
// //   console.log(a1[i]+b1[i])
// // }


// //shallow copy
// // let  arr = [1,2,4,5]
// // console.log(arr.reverse().push(8))  give the lenght of an array 
// // let t1 = arr
// // console.log(t1)

// // t1[0] = 99
// // console.log(arr[0])


// //deep copy method
// let arr3 = [1, 2, 3];    
// let t1 = [...arr3];  // or arr.slice()

// t1[0] = 99;
// console.log(arr3); // [1, 2, 3] — original is safe




// // let arr = [1, 2, 4, 5];
// // let b  = arr.reverse();       // Now arr = [5, 4, 2, 1]
// // b.push(8);         // Now arr = [5, 4, 2, 1, 8]
// // console.log(b);    // [5, 4, 2, 1, 8]


// //hosting

// console.log(x)
// var x =9

// // console.log(b)

// let b =9

// greet()
// function greet(){
//   console.log("hello")
// }



a()
b2()
var t1=87
function a(){
  let t1 = 2
  console.log(t1)
}
console.log(t1)
function b2(){
  let t2 = 6
  console.log(t2)
}


const add = (a, b) => a + b;
console.log(add(4))  //Nan


console.log(typeof(6/"5"))


let data = 7

while(data>=0){
  if(data<=5){
    data--
    continue
  }
  console.log(data)
  data--
}


let i = 5
while(true){
  console.log(i)
  i+=5
  if(i>30){
    break
  }
}


function findAdjacentDuplicates(arr) {
  const result = [];

  for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
          result.push(arr[i]);
      }
  }

  return result;
}

// Example usage
const arr1 = [32, 39, 48, 56];
const arr2 = [22, 65, 65, 39];

console.log(findAdjacentDuplicates(arr1)); // []
console.log(findAdjacentDuplicates(arr2)); // [65]



let af = 90

function test(){
  console.log(af)
   af = 90
}

test()


function sortArray(arr) {
  for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
          if (arr[i] > arr[j]) {
              // swap elements
              let temp = arr[i];
              arr[i] = arr[j];
              arr[j] = temp;
          }
      }
  }
  return arr;
}

let arr = [21, 45, 5, 7];
let sortedArr = sortArray(arr);
console.log(sortedArr); // Output: [5, 7, 21, 45]
