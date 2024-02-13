let petName = "Rocky"; // Global variable
myFunction();

function myFunction() {
  fruit = "apple"; // Considered global type is string
//   fruit = // Considered global type is undefin
    // fruit = 0; // Considered global type number
    vegetables ='potato'; // Considered global type is
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
