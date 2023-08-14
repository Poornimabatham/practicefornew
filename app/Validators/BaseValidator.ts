export default class BaseValidator {
   
    public static messages = {
     '*':(field, rule) => {
        return `${rule} validation error on ${field}`
       },
       
         required:`{{field}} is required`,
         maxLength:'length is too big',
         
      }

    }
   
