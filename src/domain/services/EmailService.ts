interface EmailAddress {
  email: string;
  name: string;
}

export interface EmailMessage {
  to: EmailAddress;
  from?: EmailAddress;
  subject: string;
}

export interface EmailService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sendEmail: (message: EmailMessage, template: string, data?: Record<string, any>) => Promise<boolean>;
}
