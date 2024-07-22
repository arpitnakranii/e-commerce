import ResetPasswordNotification from '#mails/reset_password_notification'
import VerifyENotification from '#mails/verify_e_notification'

import User from '#models/user'

import type { HttpContext } from '@adonisjs/core/http'

import mail from '@adonisjs/mail/services/main'
import vine, { SimpleMessagesProvider } from '@vinejs/vine'

import { DateTime } from 'luxon'

export default class AuthController {
  async login({ request, response }: HttpContext) {
    const data = await vine
      .compile(
        vine.object({
          email: vine.string().trim().email(),
          password: vine.string(),
        })
      )
      .validate(request.all(), {
        messagesProvider: new SimpleMessagesProvider({
          'required': 'the {{field}} field is required',
          'email.email': 'The email must be a valid email address.',
        }),
      })

    try {
      const user = await User.verifyCredentials(data.email, data.password)
      const name = data.email.split('@')

      const tocken = await User.accessTokens.create(user, ['*'], {
        expiresIn: '1 year',
        name: name[0],
      })
      console.log(tocken)

      if (!tocken.value?.release()) {
        return response.unprocessableEntity({ error: 'invalid email or password' })
      }

      return { tocken: tocken.value.release() }
    } catch (err) {
      return response.unprocessableEntity({ error: 'Invalid email or password.' })
    }
  }

  async user({ auth }: HttpContext) {
    // Check if the user is authenticated
    if (auth.user) {
      return { user: auth.user }
    } else {
      return { message: 'User not authenticated' }
    }
  }

  async register({ request, response }: HttpContext) {
    const data = request.all()
    const validate = await vine
      .compile(
        vine.object({
          email: vine.string().trim().email(),
          password: vine.string(),
        })
      )
      .validate(request.all(), {
        messagesProvider: new SimpleMessagesProvider({
          'required': 'The {{ field }} field is required.',
          'email.email': 'The email must be a valid email address.',
          'unique': 'The {{ field }} has already been taken.',
          'password.minLength': 'The password must be atleast 8 characters.',
          'password.confirmed': 'The password confirmation does not match.',
        }),
      })
    try {
      if (
        await User.query()
          // eslint-disable-next-line unicorn/no-await-expression-member
          .where('email', (await data).email)
          .first()
      )
        return response.unprocessableEntity({ error: 'The email has already been taken.' })

      const user = new User()
      user.email = data.email
      user.password = data.password
      await user.save()
      await mail.send(new VerifyENotification(user))
      return {
        success: 'Please check your email inbox (and spam) for an access link please verify email',
      }
    } catch (err) {
      return response.unprocessableEntity({ error: err.message })
    }
  }

  async verifyEmail({ params, request, response }: HttpContext) {
    console.log('verifyEmail' + request.hasValidSignature())
    if (!request.hasValidSignature()) {
      return response.unprocessableEntity({ error: 'invalid verification link' })
    }

    const email = decodeURIComponent(params.email)
    const user = await User.query().where('id', params.id).where('email', email).first()
    if (!user) {
      return response.unprocessableEntity({ error: 'invalid verification link' })
    }

    if (!user.emailVerified_at) {
      user.emailVerified_at = DateTime.utc()
      await user.save
    }
    return { success: 'Email verified successfully.' }
  }

  async forgetPassword({ request, response }: HttpContext) {
    const data = await vine
      .compile(
        vine.object({
          email: vine.string().trim().email(),
        })
      )
      .validate(request.all(), {
        messagesProvider: new SimpleMessagesProvider({
          'required': 'The {{ field }} field is required.',
          'email.email': 'The email must be a valid email address.',
        }),
      })

    const user = await User.findBy('email', data.email)

    if (!user) {
      return response.unprocessableEntity({
        error: "We can't find a user with that e-mail address",
      })
    }

    console.log(user)

    await mail.send(new ResetPasswordNotification(user))

    return { success: 'Please check your email inbox (and spam) for a password reset link.' }
  }
  async resetpassword({ request, response, params }: HttpContext) {
    if (!request.hasValidSignature()) {
      return response.unprocessableEntity({ error: 'invalid verification link' })
    }
    const user = await User.findBy('id', params.id)
    if (!user) {
      return response.unprocessableEntity({ error: 'invalid verification link' })
    }
    console.log('hello world')
    if (encodeURIComponent(user.password) !== params.token) {
      return response.unprocessableEntity({ error: 'Invalid reset password link.' })
    }

    const data = await vine
      .compile(
        vine.object({
          password: vine.string().minLength(5).confirmed(),
        })
      )
      .validate(request.all(), {
        messagesProvider: new SimpleMessagesProvider({
          'required': 'The {{ field }} field is required.',
          'password.minLength': 'The password must be atleast 8 characters.',
          'password.confirmed': 'The password confirmation does not match.',
        }),
      })
    user.password = data.password
    user.save()

    return { success: 'Password reset successfully.' }
  }

  async getUser({ request, response }: HttpContext) {
    const data = request.only(['page', 'limit'])

    const validate = vine.compile(
      vine.object({
        page: vine.number().min(1),
        limit: vine.number().min(1),
      })
    )

    const verify = await validate.validate(data)

    if (verify.limit && verify.page) {
      const userData = await User.query().select('*').orderBy('id').paginate(data.page, data.limit)
      return response.status(200).json({
        massage: 'User Data Fetch Succesfully',
        data: userData,
      })
    }
  }
}
