interface Options {
  id: string
  text: string
}

interface Email {
  type: 'EMAIL'
  question: string
  options: Options[]
  answer: string
  email: {
    from: string
    subject: string
    date: string
    link: {
      text: string
      url: string
    }
    body: string[]
  }
}
interface Sms {
  type: 'SMS'
  question: string
  options: Options[]
  answer: string
  sms: {
    number: string
    date: string
    message: string
  }
}
export type PhishingEmailQuestion = Email | Sms
