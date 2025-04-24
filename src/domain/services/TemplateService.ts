export default interface TemplateService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render: (template: string, data: Record<string, any>) => string;
}
