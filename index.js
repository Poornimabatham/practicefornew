let date = new Date();
// date.setDate(date.getDate() + 7); 

console.log(date.getMinutes())
console.log(date.getDay())
console.log(date.getHours())
console.log(date.getMilliseconds())

date.getMinutes().toString().padStart(2, '0')
console.log(typeof date.getMinutes().toString())
console.log(` The Time is ${date.getHours()}:${date.getMinutes().toString().padStart(2,'0')}`)
console.log(` The Time is ${date.getTime()}`)

