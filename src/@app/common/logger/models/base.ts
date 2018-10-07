import { ILogger, LoggerOptions, DefaultLoggerOptions } from "../interfaces";

export abstract class BaseLogger implements ILogger {

	protected options: LoggerOptions;

	protected constructor ( options?: LoggerOptions ) {
		this.options = { ...DefaultLoggerOptions, ...options };
	}

	protected decorate ( args: any ): any[] {

		if ( this.options.decorator ) {
			args[ 0 ] = [ `[ ${ this.options.decorator } ]`, args[ 0 ] ].join( " " );
		}

		if ( this.options.shouldLogTime ) {
			args[ 0 ] = [ `[ ${ Date.now() } ]`, args[ 0 ] ].join( " " );
		}

		return args;
	}

	public abstract info ( ...args: any[] ): void;
	public abstract error ( ...args: any[] ): void;
}