
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

