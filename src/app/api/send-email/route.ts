// app/api/send-email/route.ts
import { NextResponse } from 'next/server'
import {
  TransactionalEmailsApi,
  SendSmtpEmail,
  TransactionalEmailsApiApiKeys
} from '@getbrevo/brevo'

// const apiKey = process.env.BREVO_API_KEY
const apiKey = 'xkeysib-XXXXXXXXXXXXXXXXXXXXXXXXXX'
if (!apiKey) {
  throw new Error('Missing BREVO_API_KEY')
}

export async function POST(req: Request) {
  try {
    const { toEmail, toName, subject, htmlContent, textContent } =
      await req.json()

    const emailApi = new TransactionalEmailsApi()
    emailApi.setApiKey(TransactionalEmailsApiApiKeys.apiKey, String(apiKey))

    const message: SendSmtpEmail = {
      sender: { name: 'IIAP', email: 'jose.santos@unapiquitos.edu.pe' },
      to: [{ email: toEmail, name: toName }],
      subject,
      htmlContent,
      textContent
    }

    const response = await emailApi.sendTransacEmail(message)
    console.log('Brevo sendTransacEmail response:', response.response)
    return NextResponse.json({ success: true, result: response.body })
  } catch (err: unknown) {
    let message = 'Unknown error'
    if (err instanceof Error) {
      message = err.message
    } else if (
      typeof err === 'object' &&
      err !== null &&
      'message' in err &&
      typeof (err as { message: unknown }).message === 'string'
    ) {
      message = (err as { message: string }).message
    }
    console.error('Error sending email via Brevo:', err)
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
