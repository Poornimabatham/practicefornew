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
  brand: 'Ford',
  model: 'Mustang',
  color: 'red'
}

const updateMyVehicle = {
  type: 'car',
  year: 2021, 
  color: 'yellow'
}
let name2 = ["shubam", "poornima", "Om", "manshi"];
//Spread Operator
const myUpdatedVehicle = {...myVehicle, ...updateMyVehicle,...name2}

//Check the result object in the console:
console.log(myUpdatedVehicle);

let name1 = ["shubam", "poornima", "Om", "manshi"];

console.log((name1[0]).split("h").join("."))