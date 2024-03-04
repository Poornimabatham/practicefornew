// // let petName = "Rocky"; // Global variable
// // myFunction();

// // function myFunction() {
// //   fruit = "apple"; // Considered global type is string
// //   //   fruit = // Considered global type is undefin
// //   // fruit = 0; // Considered global type number
// //   vegetables = "potato"; // Considered global type is
// //   console.log(typeof petName + "- " + "My pet name is " + petName);
// // }

// // console.log(
// //   typeof petName +
// //     "- " +
// //     "My vegetables is " +
// //     vegetables +
// //     "Fruit name is " +
// //     typeof vegetables
// // );
// // let a = ["shubam", "poornima", "Om", "manshi"];
// // let results = []; // Array to store results

// // for (let i = 0; i < a.length; i++) {
// //   let result = a[i].split("").join("-");
// //   results.push(result); // Store each result in the array
// // }

// // console.log(results); // Output: ['s-h-u-b-a-m', 'p-o-o-r-n-i-m-a', 'O-m', 'm-a-n-s-h-i']

// // const myVehicle = {
// //   brand: "Ford",
// //   model: "Mustang",
// //   color: "red",
// // };

// // const updateMyVehicle = {
// //   type: "car",
// //   year: 2021,
// //   color: "yellow",
// // };
// // let name2 = ["shubam", "poornima", "Om", "manshi"];
// // //Spread Operator
// // const myUpdatedVehicle = { ...myVehicle, ...updateMyVehicle, ...name2 };

// // //Check the result object in the console:
// // console.log(myUpdatedVehicle);

// // let name1 = ["shubam", "poornima", "Om", "manshi"];

// // console.log(name1[0].split("h").join("."));

// // let evenNum = [2, 3, 4, 5, 41, 42, 43];

// // for (let i = 0; i < evenNum.length; i++) {
// //   if (evenNum[i] % 2 == 0) {
// //     console.log("even number", evenNum[i]);
// //   }
// // }

// // function is_array(input) {
// //   return Array.isArray(input);
// // }
// // // This function uses the Array.isArray() method, which returns true if the argument is an array, and false otherwise. It's a straightforward way to check if a variable is an array in JavaScript.

// // console.log(is_array('w3resource')); // false
// // console.log(is_array([1, 2, 4, 0]));

// // function deepCloneArray(array) {
// //   return array.map(item => Array.isArray(item) ? deepCloneArray(item) : item);
// // }

// // // Test the function
// // const originalArray = [1, [2, 3], { a: 4 }, [5, { b: 6 }]];
// // const clonedArray = deepCloneArray(originalArray);

// // console.log("Original Array:", originalArray);
// // console.log("Cloned Array:", clonedArray);

// // function cloneArray(array) {
// //   return array.slice(); // Using slice() method
// // }

// // // Test the function
// // const originalArray1 = [1, 2, 3, 4, 5];
// // const clonedArray1 = cloneArray(originalArray1);
// // const original = [1, 2, [4, 0]]
// // const clonedArray2=cloneArray(original)

// // console.log("Original Array:", originalArray1);
// // console.log("Cloned Array:", clonedArray1);
// // console.log("Cloned Array:", clonedArray2);

// // myColor = ["Red", "Green", "White", "Black"];

// // // Using the toString method to convert the array to a string
// // console.log(myColor.toString());

// // // Using the default join method to concatenate array elements into a string separated by commas
// // console.log(myColor.join());

// // // Using the join method with a custom separator ('+') to concatenate array elements into a string
// // console.log(myColor.join('+'));

// // let commaSeparateda = myColor.join()
// // let commaSeparated = commaSeparateda;
// // let fruitsArray = commaSeparated.split(',');
// // console.log(fruitsArray);
// // // Output: ["apple", "banana", "orange"]

// // let array = [1, 2, 2, 3, 4, 4, 5];
// // let uniqueArray = array.reduce((acc, curr) => {
// //     if (!acc.includes(curr)) {
// //         acc.push(curr);
// //     }
// //     return acc;
// // }, []);
// // console.log(uniqueArray);

// let name = "POORNIMA BATHAM";
// let words = name.split(" ");

// // Capitalize the first letter of each word
// let capitalizedWords = words.map(
//   (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
// );

// // Join the words back together
// name = capitalizedWords.join(" ");
// console.log(name.length);

// // Iterate over each character of the name
// for (let i = 0; i < name.length; i++) {
//   // Check if the character is a space
//   if (name[i] === "o") {
//     continue; // Skip to the next iteration if it's a space
//   }
//   console.log(name[i]); // Print the current character
// }

// let revereSentence = "APPLICATION INFO ABOUT ANYTHING HERE";

// // revereSentence.split("").forEach((character)=>{
// //   console.log(character.split(" ").reverse().join(" "))
// // })

// let TOLowerCase = revereSentence.split("").reverse().join("");
// TOLowerCase = TOLowerCase.toLocaleLowerCase();
// let words2 = TOLowerCase.split(" ");

// console.log(words2);
// // Capitalize the first letter of each word
// let capitalizedWords2 = words2.map(
//   // (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
//   (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
// );

// console.log(capitalizedWords2.join(" "));



// // This scope means that the variables are only accessible in the function in which they are declared.
// function fun()
// {
// 	var temp ="temp is defined in function scope";
// 	console.log(temp); 
//   let temp2 = "temp2 is defined in function scope";
// }

// fun();
// // console.log(temp); //undefined
 
// // The block scope of a variable means that the variable is accessible within the block that is between the curly braces.
// // let v2=20;
// // var v1 = 2333
// // if(true)
// // {
// //   var v1 =10;
// //   let v2=290;
// //   console.log(v1);
// //   console.log(v2); 
// // }

// // // When you run the above code, you can see that an error occurs while printing the variable v2. As var variables are function-scope based, we can access v1; however, let variables are block-scope based, which means that v2 will not be accessible outside the if block.
// // console.log(v1);
// // console.log(v2);



// let num = 123;
// console.log(typeof num); 
// let str = String(num);
// console.log(typeof str); 

// let x = 10; // x is a number
// let y = "20"; // y is a string
// let z = x + y; // JavaScript converts x to a string and concatenates it with y
// console.log(z); // Ou
// function multipleOfThree(INPUT){
//   if(INPUT%3 == 0){
//     return `${INPUT} IS A MULTIPLE OF 3`
//   }else{
//     return `${INPUT} IS A NOT MULTIPLE OF 3`

//   }
// }
//    let output = multipleOfThree(20)
//    console.log(output);
   

   
//    const offBoardType = [
//     "Resignation",
//     "Termination",
//     "Absconding",
//     "Others",
//   ];

  const grade = [
    "Top Management",
    "Middle Management",
    "Junior Management",'version Management'
  ];

  // for(let i=0;i<offBoardType.length;i++){
  //   console.log(offBoardType[i])
  // }
  var i=0
  for( i=0;i<grade.length;i++){
    const expr = grade[i];
    console.log(expr,"grade")
    switch (expr) {
      case 'Top Management':
        console.log('Oranges are $0.59 a pound.');
        break;
      case 'Middle Management':
      case 'Junior Management':
        console.log('Mangoes and papayas are $2.79 a pound.');
        // Expected output: "Mangoes and papayas are $2.79 a pound."
        break;
      default:
        console.log("Unknown")
    }

    if(expr =='Top Management'){
      console.log(`Oranges are $0.59 a pound`);
    }else if(expr =='Middle Management' || expr =='Junior Management'){
      console.log(`Oranges are $0.59 a pound`);
    }else{
      console.log("Unknown")
    }
  }
  



  
// Require http header
var http = require('http');
  
// Create server
http.createServer(function (req, res) {
 
    // HTTP Status: 200 : OK
    // Content Type: text/html
    res.writeHead(200, {'Content-Type': 'text/html'});
     
    // Send the response body as "Hello World!"  
    res.end(res.name);
 
}).listen(8080)