export class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  public info(message: string, data?: any) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [INFO] [${this.context}] ${message}`, data ? JSON.stringify(data) : '');
  }

  public error(message: string, error?: any) {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] [ERROR] [${this.context}] ${message}`, error);
  }

  public warn(message: string, data?: any) {
    const timestamp = new Date().toISOString();
    console.warn(`[${timestamp}] [WARN] [${this.context}] ${message}`, data ? JSON.stringify(data) : '');
  }
}
