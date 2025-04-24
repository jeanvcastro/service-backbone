import { EmailMessage, EmailService } from "@/domain/services/EmailService";
import LoggingService from "@/domain/services/LoggingService";
import TemplateService from "@/domain/services/TemplateService";
import { appName, appUrl } from "@/shared/env";
import { SES, type SendEmailCommandInput } from "@aws-sdk/client-ses";

export default class SESEmailService implements EmailService {
  private readonly transporter: SES;

  constructor(
    protected readonly templateService: TemplateService,
    private readonly logger: LoggingService
  ) {
    this.transporter = new SES({
      apiVersion: "2010-12-01",
      region: process.env.AWS_SES_REGION ?? "us-east-2",
      credentials: {
        accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID ?? "",
        secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY ?? ""
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async sendMail(message: EmailMessage, template: string, data: Record<string, any> = {}): Promise<boolean> {
    try {
      const sendEmailCommandInput = this.getSendEmailCommandInput(message, template, data);
      await this.transporter.sendEmail(sendEmailCommandInput);
      return true;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }

  private getSendEmailCommandInput(
    message: EmailMessage,
    template: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: Record<string, any> = {}
  ): SendEmailCommandInput {
    const senderName = appName;
    const domain = appUrl ? new URL(appUrl).hostname : "localhost";
    const senderAddress = `noreply@${domain}`;
    const source = `${senderName} <${senderAddress}>`;

    const body = this.templateService.render(template, data);

    const sendEmailCommandInput: SendEmailCommandInput = {
      Destination: {
        ToAddresses: [message.to.email]
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: body
          }
        },
        Subject: {
          Charset: "UTF-8",
          Data: message.subject
        }
      },
      Source: source,
      ReplyToAddresses: [senderAddress]
    };

    return sendEmailCommandInput;
  }
}
