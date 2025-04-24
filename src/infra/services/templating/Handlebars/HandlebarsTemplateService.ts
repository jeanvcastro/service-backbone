import { BaseError } from "@/domain/errors";
import TemplateService from "@/domain/services/TemplateService";
import fs from "fs";
import Handlebars from "handlebars";
import path from "path";

export class TemplateNotFoundException extends BaseError {
  constructor(templateName: string) {
    super({
      code: "TEMPLATE_NOT_FOUND",
      message: `Template ${templateName} not found`,
      isExpected: false,
      httpCode: 404
    });
  }
}

export default class HandlebarsTemplateService implements TemplateService {
  private readonly templatesPath: string;

  constructor() {
    this.templatesPath = path.resolve(__dirname, "templates");

    this.registerPartials();
  }

  private registerPartials() {
    const partialsPath = path.join(this.templatesPath, "partials");

    const partials = fs.readdirSync(partialsPath);

    partials.forEach(partial => {
      const partialName = path.parse(partial).name;
      const partialFile = fs.readFileSync(path.join(partialsPath, partial), "utf8");
      Handlebars.registerPartial(partialName, partialFile);
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render(template: string, data: Record<string, any>): string {
    const templateFilePath = path.join(this.templatesPath, `${template}.hbs`);

    if (!fs.existsSync(templateFilePath)) {
      throw new TemplateNotFoundException(template);
    }

    const templateContent = fs.readFileSync(templateFilePath, "utf8");
    const compiled = Handlebars.compile(templateContent);
    return compiled(data);
  }
}
