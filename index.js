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
