// define our tuple
var ourTuple;
// initialize correctly
ourTuple = [5, false, 'Coding God was here'];
// We have no type safety in our tuple for indexes 3+
// ourTuple.push('Something new and wrong');
console.log(ourTuple);
// Try playing around with modifying properties and adding ones to see what happens
var car = {
    type: "Toyota",
    model: "Corolla",
    year: 2009
};
console.log(car.type);
console.log();
var str = "Suraj&*  Test1&";
// Remove spaces between words
var result = str.replace(/[^\w\s]/g, '');
console.log(result); // Output:
function isAdult(user) {
    return user.age >= 18;
}
var justine = {
    name: 'Justine',
    age: 23,
};
var isJustineAnAdult = isAdult(justine);
console.log(isJustineAnAdult);
function profile(appProfile) {
    return appProfile.AdminSts == 1;
}
var profileObj = {
    ProfileName: 'Super Admin',
    AdminSts: 1
};
var output = profile(profileObj);
console.log("The AdmnsSts of ".concat(profileObj.ProfileName, " is ").concat(output, " "));
// Example no 4
// Function that returns a string representing a cup of green tea
var prepareTea = function () { return 'greenTea'; };
/*
Given a function (representing the tea type) and number of cups needed, the
following function returns an array of strings (each representing a cup of
a specific type of tea).
*/
var getTea = function (numOfCups) {
    var teaCups = [];
    console.log(numOfCups.TypeofTea);
    var countofTea = numOfCups.Quanity;
    for (var cups = 1; cups <= countofTea; cups += 1) {
        var teaCup = prepareTea();
        console.log(numOfCups.TypeofTea == teaCup);
        if (numOfCups.TypeofTea == teaCup) {
            console.log(teaCup, "teaCup");
            teaCups.push(teaCup);
        }
    }
    return teaCups;
};
var Details = {
    Quanity: 5,
    TypeofTea: 'green Tea'
};
var howmuchdrinkisprepared = getTea(Details);
console.log(howmuchdrinkisprepared);
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
console.log(checkScope());
