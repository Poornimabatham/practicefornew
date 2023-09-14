import { AuthenticationException } from '@adonisjs/auth/build/standalone'
import type { GuardsList } from '@ioc:Adonis/Addons/Auth'
import Redis from '@ioc:Adonis/Addons/Redis'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'


 /* Auth middleware is meant to restrict un-authenticated access to a given route
 * or a group of routes.
 *
 * You must register this middleware inside `start/kernel.ts` file under the list
 * of named middleware.
 */
export default class AuthMiddleware {
  /**
   * The URL to redirect to when request is Unauthorized
   */
  protected redirectTo = '/login'

  /**
   * Authenticates the current HTTP request against a custom set of defined
   * guards.
   *
   * The authentication loop stops as soon as the user is authenticated using any
   * of the mentioned guards and that guard will be used by the rest of the code
   * during the current request.
   */
  protected async authenticate(auth: HttpContextContract['auth'], guards: (keyof GuardsList)[]) {
    /**
     * Hold reference to the guard last attempted within the for loop. We pass
     * the reference of the guard to the "AuthenticationException", so that
     * it can decide the correct response behavior based upon the guard
     * driver
     */
    let guardLastAttempted: string | undefined

    for (let guard of guards) {
      guardLastAttempted = guard

      if (await auth.use(guard).check()) {
        
        auth.defaultGuard = guard
        return true
      }
    }

    /**
     * Unable to authenticate using any guard
     */
    throw new AuthenticationException(
      'Unauthorized access',
      'E_UNAUTHORIZED_ACCESS',
      guardLastAttempted,
      this.redirectTo,
    )
  }

  /**
   * Handle request
   */
  public async handle (
    { auth,response }: HttpContextContract,
    next: () => Promise<void>,
    customGuards: (keyof GuardsList)[]
  ) {
    
    //const apitoken = await Redis.get('token')
    
   
   // response.header('Authorization',`bearer ${apitoken}`);
   
    const guards = customGuards.length ? customGuards : [auth.name]
    //console.log(auth);
    
    
    await this.authenticate(auth, guards)
    await next()
  }
}
