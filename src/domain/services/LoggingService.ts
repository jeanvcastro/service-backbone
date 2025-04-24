type LogMethod = (data: unknown) => void;

export default interface LoggingService {
  debug: LogMethod;
  info: LogMethod;
  warn: LogMethod;
  error: LogMethod;
  fatal: LogMethod;
}
