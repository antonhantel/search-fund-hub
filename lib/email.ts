import nodemailer from 'nodemailer'

// Configure email transporter
// In production, use proper SMTP credentials via environment variables
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

interface ApplicationEmailData {
  candidateName: string
  candidateEmail: string
  jobTitle: string
  companyName: string
}

export async function sendApplicationConfirmation(data: ApplicationEmailData) {
  const { candidateName, candidateEmail, jobTitle, companyName } = data

  // Only send if SMTP is configured
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('Email not sent: SMTP not configured. Would have sent to:', candidateEmail)
    return { success: true, simulated: true }
  }

  const mailOptions = {
    from: `"Search Fund Hub" <${process.env.SMTP_USER}>`,
    to: candidateEmail,
    subject: `Application Received: ${jobTitle} at ${companyName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%); padding: 30px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Search Fund Hub</h1>
          </div>

          <div style="background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; border-top: none;">
            <h2 style="color: #1e3a5f; margin-top: 0;">Thank you for your application, ${candidateName}!</h2>

            <p style="color: #475569;">
              We have received your application for the position of <strong>${jobTitle}</strong> at <strong>${companyName}</strong>.
            </p>

            <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #1e3a5f; margin-top: 0; font-size: 16px;">What happens next?</h3>
              <ul style="color: #475569; padding-left: 20px;">
                <li>The hiring team will review your application</li>
                <li>If your profile matches their requirements, they will contact you directly</li>
                <li>The typical response time is 1-2 weeks</li>
              </ul>
            </div>

            <p style="color: #475569;">
              In the meantime, feel free to explore more opportunities on our platform.
            </p>

            <a href="https://searchfundhub.de/jobs" style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 10px;">
              Browse More Jobs
            </a>

            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">

            <p style="color: #94a3b8; font-size: 14px; margin-bottom: 0;">
              Best regards,<br>
              The Search Fund Hub Team
            </p>
          </div>

          <div style="background: #1e3a5f; padding: 20px; border-radius: 0 0 12px 12px; text-align: center;">
            <p style="color: #94a3b8; font-size: 12px; margin: 0;">
              This is an automated message from Search Fund Hub.<br>
              <a href="https://searchfundhub.de" style="color: #60a5fa;">searchfundhub.de</a>
            </p>
          </div>
        </body>
      </html>
    `,
    text: `
Thank you for your application, ${candidateName}!

We have received your application for the position of ${jobTitle} at ${companyName}.

What happens next?
- The hiring team will review your application
- If your profile matches their requirements, they will contact you directly
- The typical response time is 1-2 weeks

In the meantime, feel free to explore more opportunities on our platform at https://searchfundhub.de/jobs

Best regards,
The Search Fund Hub Team
    `.trim(),
  }

  try {
    await transporter.sendMail(mailOptions)
    return { success: true }
  } catch (error) {
    console.error('Failed to send email:', error)
    return { success: false, error }
  }
}

interface NewApplicationNotificationData {
  employerEmail: string
  candidateName: string
  jobTitle: string
  applicationId: string
}

export async function sendNewApplicationNotification(data: NewApplicationNotificationData) {
  const { employerEmail, candidateName, jobTitle, applicationId } = data

  // Only send if SMTP is configured
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('Email not sent: SMTP not configured. Would have notified:', employerEmail)
    return { success: true, simulated: true }
  }

  const mailOptions = {
    from: `"Search Fund Hub" <${process.env.SMTP_USER}>`,
    to: employerEmail,
    subject: `New Application: ${candidateName} for ${jobTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #1e3a5f; padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 20px;">New Application Received</h1>
          </div>

          <div style="background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
            <p><strong>${candidateName}</strong> has applied for <strong>${jobTitle}</strong>.</p>

            <a href="https://searchfundhub.de/employer/applications" style="display: inline-block; background: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: 600;">
              View Application
            </a>

            <p style="color: #64748b; font-size: 14px; margin-top: 20px;">
              Log in to your dashboard to review the candidate's details and resume.
            </p>
          </div>
        </body>
      </html>
    `,
    text: `New Application Received\n\n${candidateName} has applied for ${jobTitle}.\n\nLog in to your dashboard to review: https://searchfundhub.de/employer/applications`,
  }

  try {
    await transporter.sendMail(mailOptions)
    return { success: true }
  } catch (error) {
    console.error('Failed to send notification email:', error)
    return { success: false, error }
  }
}
