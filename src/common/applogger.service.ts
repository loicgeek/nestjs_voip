import { Logger } from '@nestjs/common';

export class AppLogger extends Logger {
  error(message: string, trace: string, context?: string) {
    // add your tailored logic here
    super.error(
      message,
      trace,
      context ?? __filename.split('/')[__filename.split('/').length - 1],
    );
  }
  log(message: string, context?: string) {
    console.log(
      ' file name ' + __filename.split('/')[__filename.split('/').length - 1],
    );

    super.log(
      message,
      context ?? __filename.split('/')[__filename.split('/').length - 1],
    );
  }
}
