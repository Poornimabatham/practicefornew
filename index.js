let petName = "Rocky"; // Global variable
myFunction();

function myFunction() {
  fruit = "apple"; // Considered global type is string
  //   fruit = // Considered global type is undefin
  // fruit = 0; // Considered global type number
  vegetables = "potato"; // Considered global type is
  console.log(typeof petName + "- " + "My pet name is " + petName);
}

console.log(
  typeof petName +
    "- " +
    "My vegetables is " +
    vegetables +
    "Fruit name is " +
    typeof vegetables
);
let a = ["shubam", "poornima", "Om", "manshi"];
let results = []; // Array to store results

for (let i = 0; i < a.length; i++) {
  let result = a[i].split("").join("-");
  results.push(result); // Store each result in the array
}

console.log(results); // Output: ['s-h-u-b-a-m', 'p-o-o-r-n-i-m-a', 'O-m', 'm-a-n-s-h-i']

const myVehicle = {
  brand: "Ford",
  model: "Mustang",
  color: "red",
};

const updateMyVehicle = {
  type: "car",
  year: 2021,
  color: "yellow",
};
let name2 = ["shubam", "poornima", "Om", "manshi"];
//Spread Operator
const myUpdatedVehicle = { ...myVehicle, ...updateMyVehicle, ...name2 };

//Check the result object in the console:
console.log(myUpdatedVehicle);

let name1 = ["shubam", "poornima", "Om", "manshi"];

console.log(name1[0].split("h").join("."));

let evenNum = [2, 3, 4, 5, 41, 42, 43];

for (let i = 0; i < evenNum.length; i++) {
  if (evenNum[i] % 2 == 0) {
    console.log("even number", evenNum[i]);
  }
}

function is_array(input) {
  return Array.isArray(input);
}
// This function uses the Array.isArray() method, which returns true if the argument is an array, and false otherwise. It's a straightforward way to check if a variable is an array in JavaScript.

console.log(is_array('w3resource')); // false
console.log(is_array([1, 2, 4, 0])); 



function deepCloneArray(array) {
  return array.map(item => Array.isArray(item) ? deepCloneArray(item) : item);
}

// Test the function
const originalArray = [1, [2, 3], { a: 4 }, [5, { b: 6 }]];
const clonedArray = deepCloneArray(originalArray);

console.log("Original Array:", originalArray);
console.log("Cloned Array:", clonedArray);

function cloneArray(array) {
  return array.slice(); // Using slice() method
}

// Test the function
const originalArray1 = [1, 2, 3, 4, 5];
const clonedArray1 = cloneArray(originalArray1);
const original = [1, 2, [4, 0]]
const clonedArray2=cloneArray(original)

console.log("Original Array:", originalArray1);
console.log("Cloned Array:", clonedArray1);
console.log("Cloned Array:", clonedArray2);


myColor = ["Red", "Green", "White", "Black"];

// Using the toString method to convert the array to a string
console.log(myColor.toString());

// Using the default join method to concatenate array elements into a string separated by commas
console.log(myColor.join());

// Using the join method with a custom separator ('+') to concatenate array elements into a string
console.log(myColor.join('+'));

let commaSeparateda = myColor.join()
let commaSeparated = commaSeparateda;
let fruitsArray = commaSeparated.split(',');
console.log(fruitsArray); 
// Output: ["apple", "banana", "orange"]


