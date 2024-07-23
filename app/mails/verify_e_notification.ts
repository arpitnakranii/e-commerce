import User from '#models/user'
import env from '#start/env'
import router from '@adonisjs/core/services/router'
import { BaseMail } from '@adonisjs/mail'

export default class VerifyENotification extends BaseMail {
  from = env.get('MAIL_FROM')
  subject = 'Verify Email Address'

  constructor(private user: User) {
    super()
  }

  prepare() {
    const signedURL = router
      .builder()
      .prefixUrl(env.get('API_URL') || 'http://localhost:3333')
      .params({ id: this.user.id, email: this.user.email })
      .makeSigned('verifyEmail', {
        expiresIn: '30 minutes',
      })
    this.message.to(this.user.email).htmlView('emails/verify_email_html', { signedURL })
  }
}
