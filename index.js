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
