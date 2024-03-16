function add(x, y) {
  console.log("wer", x == 0 ? 9 : 10);
  if (x == 0 ? 9 : 10) {
    return x + y;
  }
}

var x = 1,
  y = 2;
z = x + y;
console.log(z);

var str = "123"; // This is a string
var num = 456; // This is a number
console.log(2 + 9 + "9"); //119
console.log(3 + 7 + "grdade000");
// Convert the string to a number
var strToNum = parseInt(str);

// Perform addition
var result = strToNum + num;

console.log(result);

let a = 10;
let b = 30;
let c;
console.log(`a = ${a}, b = ${b}`);

c = a; //10
a = b; //30
b = c; //10
console.log(`a = ${a}, b = ${b}`);

let a1 = 5;
while (a1 <= 10) {
  console.log(`a = ${a1} `);
  a1++;
}


let Status = 11
const Attendancestatus = Status
            switch (Attendancestatus) {
              case 11:
                AttStscolor = "0xFFf39c12";
                Status = "Weekly Off";
              case 12:
                AttStscolor = "0xFF00a65a";
                Status = "Holiday(Unpaid)";
                break;
              case 13:
                AttStscolor = "0xFFf39c12";
                Status = "Weekly Off(Unpaid)";
                break;
              case 14:
                AttStscolor = "0xFF00a65a";
                Status = "Holiday";
                break;
              default:
                AttStscolor = "0xFF3c8dbc";
                Status = "";
                break;
            }


console.log(AttStscolor)
console.log(Status)





// nested for loops

// first loop
for (let i = 1; i <= 3; i++) {

    // second loop
    for (let j = 1; j <= 3; j++) {
        if (i == 2) {
          break;
        }
        console.log(`i = ${i}, j = ${j}`);
    }
}


module.exports = add;
