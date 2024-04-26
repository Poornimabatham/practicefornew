
// define our tuple
let ourTuple:readonly  [number, boolean, string];

// initialize correctly
ourTuple = [5, false, 'Coding God was here'];

// We have no type safety in our tuple for indexes 3+
// ourTuple.push('Something new and wrong');

console.log(ourTuple);

// Try playing around with modifying properties and adding ones to see what happens
const car: { type: string, model: string, year: number } = {
    type: "Toyota",
    model: "Corolla",
    year: 2009
  };
  

  console.log(car.type);
  console.log()

  let str = "Suraj&*  Test1&";

// Remove spaces between words

let result = str.replace(/[^\w\s]/g, '');

console.log(result); // Output:
// 2.Example Nod-2

type User = {
  name: string;
  age: number;
};

function isAdult(user: User): boolean {
  return user.age >= 18;
}

const justine: User = {
  name: 'Justine',
  age: 23,
};


const isJustineAnAdult: boolean = isAdult(justine);
console.log(isJustineAnAdult)

//Example No-3
type ProfileType ={
  ProfileName:string,
  AdminSts:number
}
function profile(appProfile:ProfileType){
  return appProfile.AdminSts==1
}
const profileObj:ProfileType = {
  ProfileName:'Super Admin',
  AdminSts:1
}
let output:boolean = profile(profileObj)
console.log(`The AdmnsSts of ${profileObj.ProfileName} is ${output} `)

// Example no 4
// Function that returns a string representing a cup of green tea
const prepareTea = () => 'greenTea';

/*
Given a function (representing the tea type) and number of cups needed, the
following function returns an array of strings (each representing a cup of
a specific type of tea).
*/
const getTea = (numOfCups) => {
  const teaCups:any[] = [];
console.log(numOfCups.TypeofTea,)
let countofTea = numOfCups.Quanity
  for(let cups = 1; cups <= countofTea; cups += 1) {
    const teaCup = prepareTea();
    console.log(numOfCups.TypeofTea ==teaCup)
    if(numOfCups.TypeofTea ==teaCup){
      console.log(teaCup,"teaCup")
      teaCups.push(teaCup);
    }
    
  }
  return teaCups;
};
let Details = {
Quanity:5,
TypeofTea:'green Tea'
}
let howmuchdrinkisprepared= getTea(Details)
console.log(howmuchdrinkisprepared)

//Example No-5
function checkScope() {
  var i = 'function scope';
  if (false) {
    i = 'block scope';
    console.log('Block scope i is: ', i);
  }
  console.log('Function scope i is: ', i);
  return i;
}
console.log(checkScope())