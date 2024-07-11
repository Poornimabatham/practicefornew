// let date = new Date();
// // date.setDate(date.getDate() + 7); 

// console.log(date.getMinutes())
// console.log(date.getDay())
// console.log(date.getHours())
// console.log(date.getMilliseconds())

// date.getMinutes().toString().padStart(2, '0')
// console.log(typeof date.getMinutes().toString())
// console.log(` The Time is ${date.getHours()}:${date.getMinutes().toString().padStart(2,'0')}`)
// console.log(` The Time is ${date.getTime()}`)


// let a = 'poornima';
// a = Array.from(a); // Convert the string to an array
// let x = a.length; // Get the length of the array
// console.log(x); // Log the length of the array

// while(x > 0) {
//     if(a[x] === 'r') {
//         a[x] = 'R'; // Replace 'r' with 'R'
//     }
//     x--; // Decrement x first to get correct index

// }

// a = a.join(''); // Convert the array back to a string
// console.log(a); // Log the modified string
// // // Expected output: Array ["f", "o", "o"]


// let a1 = 'poornima';
// a1 = Array.from(a); // Convert the string to an array
// let x1 = 0; // Initialize x to 0

// while(x1 < a.length) {
//     if(a1[x1] === 'r') {
//         a1[x1] = 'R'; // Replace 'r' with 'R'
//     }
//     x1++; // Move to the next index
// }

// a1 = a1.join(''); // Convert the array back to a string
// console.log(a1); // Log the modified string

// console.log(Array.from([1, 2, 3], (x) => x + x));

// const fruits = [];
// fruits.push('kiwi');
// fruits.push('cherry');
// fruits.push('strawberry');
// fruits.push('Banana');

// fruits.push('Orange');

// fruits.push('Apple');
// fruits.push('Mango');



// console.log(fruits); // Log the modified string
// fruits.pop()

// console.log(fruits); // Log the modified string



// Initializing an empty object
const fruits = {};

// Adding properties to the object
fruits['1'] = 'kiwi';
fruits['2'] = 'cherry';
fruits['3'] = 'strawberry';
fruits['4'] = 'Banana';
fruits['5'] = 'Orange';
fruits['6'] = 'Apple';
fruits['7'] = 'Mango';

console.log(fruits); // Log the modified object

// Removing the last added property
delete fruits['7'];

console.log(fruits); // Log the modified object
