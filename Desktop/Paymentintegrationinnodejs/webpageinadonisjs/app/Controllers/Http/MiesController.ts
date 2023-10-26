import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class MiesController {
    public async showTemplate({ view }: HttpContextContract) {
        const greeting = 'Welcome to Adonis.js';
        const greeting2 = 'Welcome to javscript';

        return view.render('welcome', { greeting,greeting2});
    }
}
