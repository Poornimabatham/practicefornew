// a set of values we define and use only from define values 

enum days{
    mon,tues,wed,thu,fri,sat,sun
}
let wichday:days;
wichday = 1
wichday=days.tues

// wichday="test" cant assign bcs enum have already decalare there properties above
// and it take bydefault value 0 to so 
console.log(wichday)