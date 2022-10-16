import dotenv from 'dotenv'
import nodemailer from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport/index'
import { create } from 'express-handlebars';
import nmehbs from 'nodemailer-express-handlebars'
import { join } from 'path';


// Load env variables
dotenv.config()
const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SMTP_FROM,
} = process.env

export default class Mailer {
  static sendEmail(to: string, subject: string, template: string, context: any): Promise<SMTPTransport.SentMessageInfo> {
    const mailer = nodemailer.createTransport(
      {
        host: SMTP_HOST,
        port: Number(SMTP_PORT),
        secure: true,
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS,
        },
        logger: false,
        debug: false,
      },
      {
        from: SMTP_FROM,
      },
    )
  
    // Set up Handlebars for Nodemailer
    const expressHandlebars = create({
      partialsDir: join(__dirname, '../templates/partials'),
      layoutsDir: join(__dirname, '../templates/layouts'),
      defaultLayout: 'email',
      extname: '.hbs',
      helpers: {
        currentYear: () => (new Date()).getFullYear(),
      },
    })
  
    mailer.use('compile', nmehbs({
      viewEngine: expressHandlebars,
      viewPath: join(__dirname, '../templates'),
      extName: '.hbs',
    }))

    const options = {
      from: SMTP_FROM,
      to,
      subject,
      context,
      template,
      trackingSettings: {
        clickTracking: {
          enable: false,
          enableText: false,
        },
        openTracking: {
          enable: false,
        },
      },
    }

    return new Promise((resolve, reject) => {
      mailer.sendMail(options, (error, info) => {
        if (error) return reject(error)
        resolve(info)
      })
    })
  }
}