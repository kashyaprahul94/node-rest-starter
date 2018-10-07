import { LogLevel } from "../enums";
import { ILogger, LoggerOptions } from "../interfaces";

import { BaseLogger } from "./base";

export class ConsoleLogger extends BaseLogger implements ILogger {

	public constructor ( options?: LoggerOptions ) {
		super( options );
	}

	private log ( type: LogLevel, ...args: any[] ): void {
		args = super.decorate( args );
		if ( type === LogLevel.Info ) {
			console.info.apply( console, args );
		} else if ( type === LogLevel.Error ) {
			console.error.apply( console, args );
		} else {
			console.log.apply( console, args );
		}
	}

	public info ( ...args: any[] ): void {
		this.log( LogLevel.Info, ...args );
	}

	public error ( ...args: any[] ): void {
		this.log( LogLevel.Error, ...args );
	}
}