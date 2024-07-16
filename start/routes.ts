/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import AuthController from '#controllers/auth_controller'
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js';


router.get('/', async () => {
 
  return {
    hello: 'world',
    
  }
})

router.post('auth/login',[AuthController,'login']);
router.post('auth/register',[AuthController,'register']);

router.get('auth/user',[AuthController,'getUser']).use(middleware.auth({guards:['api']}))
router.get('auth/email/verify/:email/:id',[AuthController,'verifyEmail']).as('verifyEmail')
router.post('auth/password/forgot',[AuthController,'forgetPassword'])
router.post('auth/password/reset/:id/:token',[AuthController,'resetpassword']).as('resetpassword')
