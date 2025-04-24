import { EmailService } from "@/domain/services/EmailService";
import LoggingService from "@/domain/services/LoggingService";
import TemplateService from "@/domain/services/TemplateService";
import SESEmailService from "@/infra/services/email/SESEmailService";
import WinstonLogger from "@/infra/services/logging/WinstonLogger";
import HandlebarsTemplateService from "@/infra/services/templating/Handlebars/HandlebarsTemplateService";
import { DIContainer } from "@/shared/kernel/DIContainer";
import { SendOrderNotificationUseCase } from "./SendOrderNotificationUseCase";

export function configureDI() {
  const container = new DIContainer<{
    LoggingService: LoggingService;
    TemplateService: TemplateService;
    EmailService: EmailService;

    SendOrderNotificationUseCase: SendOrderNotificationUseCase;
  }>();

  // services
  container.add("LoggingService", () => new WinstonLogger());
  container.add("TemplateService", () => new HandlebarsTemplateService());
  container.add(
    "EmailService",
    ({ TemplateService, LoggingService }) => new SESEmailService(TemplateService, LoggingService)
  );

  // use cases
  container.add("SendOrderNotificationUseCase", ({ EmailService }) => new SendOrderNotificationUseCase(EmailService));

  return container;
}
