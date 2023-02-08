import { fetch } from "@remix-run/node"
import { db } from "../db.server"

type EmailPerson = {
    name: String
    email: String
}
const payload = (to: EmailPerson[], from: EmailPerson, subject: string, content: string) => (
    {
        personalizations: [
            {
                to
            }
        ],
        from,
        subject,
        content: [
            {
                type: 'text/html',
                value: content
            }
        ]

    })

export async function sendMail(subject: string, content: string) {
    const senders = await db.email.findMany({
        select: {
            name: true,
            email: true,
            isSender: true
        },
    })

    return fetch("https://api.sendgrid.com/v3/mail/send", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.EMAIL_KEY}`
        },
        body: JSON.stringify(payload(senders, senders.filter(s => s.isSender)[0], subject, content))
    })
}
