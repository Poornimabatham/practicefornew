export default class BaseValidator {
    /**
      * Custom messages for validation failures. You can make use of dot notation `(.)`
      * for targeting nested fields and array expressions `(*)` for targeting all
      * children of an array. For example:
      *
      * {
      *   'profile.username.required': 'Username is required',
      *   'scores.*.number': 'Define scores as valid numbers'
      * }
      *
      */
     static messages = {
       '*':(field, ) => {
           return `validation error on ${field}`
         },
         required: '{{ field }} is required'
     }
   }