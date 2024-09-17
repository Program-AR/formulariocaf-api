import { base64logo } from "./hdLogo"
import * as nodemailer from 'nodemailer'

export const whatsappNumber = '+54 9 11 5555 5555'

export const createMailerTransport = (user: string | undefined, pass: string | undefined) =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST || '',
    port: process.env.SMTP_PORT || '',
    secure: false,
    auth: {
      user: user || '',
      pass: pass || ''
    },
    tls: {
      rejectUnauthorized: false
    }
  } as any)

export const hdMail = (to: string, subject: string, content: string, attachment?: any) => ({
  //The from is being automatically calculated from the transport used to send the mail.
  to: to,
  attachments: [ attachment ? {...attachment} : {}, {
    filename: 'logo-hd.png',
    content: base64logo,
    encoding: 'base64',
    cid: 'hd'
  }],
  subject: subject,
  html: `
        <div style='background:#EEEpadding:50px'>
          <div style='background:#FFFcolor:#000font-family:sans-serif'>
            <h3 style='background:#3f51b5color:#FFFpadding:30pxmargin:0text-align:leftfont-size:22px'>
              ${subject}
            </h3>
            <div style='padding:30pxfont-size:16px'>
              ${applyStyles(content)}
              <p><i><br>CAF - Herramienta Digital</br></p></i>
              <img src="cid:hd" />
            </div>
          </div>
        </div>
      `
})

const applyStyles = (content: string) => {
  const border = 'border: 1px solid gray border-collapse: collapse'
  return content.
    replace(/<table>/g, `<table style="${border}">`).
    replace(/<th>/g, `<th style="${border}">`).
    replace(/<td>/g, `<td style="${border}">`)
}