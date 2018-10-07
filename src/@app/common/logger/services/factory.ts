import { LogVarient } from "../enums";
import { ILogger, ILoggerFactoryOptions } from "../interfaces";

import { ConsoleLogger } from "../models";

export class LoggerFactory {

	private delegate: ILogger;

	private constructor ( delegate: ILogger ) {
		this.delegate = delegate;
	}

	public static Attach ( logger: ILogger ): ILogger {
		return new LoggerFactory( logger ).delegate;
	}

	public static Instance ( { type = LogVarient.Console, options }: ILoggerFactoryOptions = {} ): ILogger {
		if ( type === LogVarient.Console ) {
			return new LoggerFactory( new ConsoleLogger( options ) ).delegate;
		} else {
			return new LoggerFactory( new ConsoleLogger( options ) ).delegate;
		}
	}
}