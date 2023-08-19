import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import Helper from "App/Helper/Helper";
const jwt = require("jsonwebtoken");

export default class Login {
  public async handle(
    { request, response }: HttpContextContract,
    next: () => Promise<void>,ctx
  ) {
    var arr = request.headers().authorization;
    var token = arr ?.split("@@")[1];
    var key = process.env.secretKey;
    ctx.auth = { "user":0 };
    try {
      var decoded = jwt.verify(token, key);
      if (Object.keys(decoded).length > 0) {
        let empid =  Helper.decode5t(decoded.Id);
        const query = await Database.query()
          .select("*")
          .from("Emp_key_Storage")
          .where("EmployeeId", empid)
          .andWhere("Token", "LIKE", "%" + token + "%");
        if (query.length > 0) {
          ctx.auth = { "user":query[0].EmployeeId };
          
          
          await next();
        } else {
          response.status(400).send({ Message: "Invalid Access" });
        }
        await next();
      } else {
        response.status(400).send({ Message: "Token Not Decoded" });
      }
    }catch (err) {
      if (err) {
        if (err.name == "TokenExpiredError") {
          response.status(400).send({ Message: err.message, name:"Token Expired" });
        } else if (err.name == "JsonWebTokenError") {
          response.status(401).send({ Message: err.message, name: err.name });
        } else {
          response.status(402).send({ Message: err.message });
        }
      }
    }
  }
}
