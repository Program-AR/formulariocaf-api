import { Next, Request, Response } from 'restify'
import { Role } from '../../persistence/models/Role'
import { User } from '../../persistence/models/User'
import { Context } from '../../typings/common'
import { generateToken } from '../../utils'
import { hdMail } from '../../utils/emails'
import { send } from '../../utils/send'
import { BadRequest } from '../../router/error/serverError'

export default async (req: Request, res: Response, next: Next) => {
  const { context, body } = req
  try {
    const { email, lang } = body
    const user = await context.webDB.getRepository(User).findOne({
      where: { email },
      include: [Role]
    })
    if (!user) return next(new BadRequest(`Email ${email} doesn't exist`))
    if (!lang) return next(new BadRequest(`Problem with language. Email not Sent`))

    await sendRecoveryEmail(context, user, lang)
    await send(req, res, 200, {})

  } catch (err) {
    context.logger.error('Error in password recovery', err)
    await send(req, res, 500, {
      error: 'Error in password recovery: ' + err.message
    })
  }
}

const sendRecoveryEmail = ({ infoTransport }: Context, user: User, lang: string) => {

  const recoveryUrl=`${process.env.WEB_PASSWORD_RECOVERY}/password-recovery?access_token=${generateToken({
                userId: user.id,
                roles: user.roleValues()
              })}&recovery=true`
  switch (lang) {
    case 'es-ar':
      return infoTransport.sendMail(hdMail(user.email, "Recuperación de contraseña de la Herramienta Digital de CAF", `
                  <p style='margin:0 0 20pxfont-size:18px'></p>
                  <p>Estimado/a usuario/a</p>
                  <p>Está recibiendo este e-mail porque ha solicitado un cambio de contraseña de la cuenta asociada a la Herramienta Digital de CAF. Si no fue quien lo solicitó, descarte este e-mail.</p>
                  <p>Para cambiar la contraseña debe hacer click <a href=${recoveryUrl}>aquí</a> (o copiar el enlace en el navegador)</p>
              <p><br/>Atentamente,</p>
              `))
    case 'en-us':
      return infoTransport.sendMail(hdMail(user.email, "Password Recovery - CAF - Digital Tool", `
                  <p style='margin:0 0 20pxfont-size:18px'></p>
                  <p>Dear user</p>
                  <p>You are receiving this email because you have requested a password change for the account associated with the CAF - Digital Tool. If you were not the one who requested it, discard this email.</p>
                  <p>To change your password you must click <a href=${recoveryUrl}>here</a> (or copy the link in the browser)</p>
              <p><br/>Best regards,</p>
              `))
    case 'pt-br':
      return infoTransport.sendMail(hdMail(user.email, "Recuperação de senha do CAF - Ferramenta Digital", `
                  <p style='margin:0 0 20pxfont-size:18px'></p>
                  <p>Querido usuário</p>
                  <p>Você está recebendo este e-mail porque solicitou a alteração da senha da conta associada ao Ferramenta Digital - CAF. Se não foi você quem solicitou, descarte este e-mail.</p>
                  <p>Para alterar a senha você deve clicar <a href=${recoveryUrl}>aqui</a> (ou copiar o link no navegador)</p>
              <p><br/>Atenciosamente,</p>
              `))
  default: return ''
  }
}