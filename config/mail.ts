import env from '#start/env'
import { defineConfig, transports } from '@adonisjs/mail'

const mailConfig = defineConfig({
  default: 'smtp',

   /**
    * The mailers object can be used to configure multiple mailers
    * each using a different transport or same transport with different
    * options.
   */
   mailers: {
    smtp: transports.smtp({
      host: env.get('SMTP_HOST'),
      port: env.get('SMTP_PORT'),
      secure: false,

      auth: {
        type: 'login',
       user:process.env.SMTP_USERNAME||'f9f011c6f977b9',
       pass:process.env.SMTP_PASSWORD||'c4db7b2235bb79'
      },

      tls: {},

      ignoreTLS: false,
      requireTLS: false,

      pool: false,
      maxConnections: 5,
      maxMessages: 100,
    })
  }
})

export default mailConfig

declare module '@adonisjs/mail/types' {
  export interface MailersList extends InferMailers<typeof mailConfig> {}
}