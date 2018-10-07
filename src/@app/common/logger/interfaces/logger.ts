import { LogVarient } from "../enums";

import { LoggerOptions } from "./options";

export interface ILogger {
	info ( ...args: any[] ): void;
	error ( ...args: any[] ): void;
}

export interface ILoggerFactoryOptions {
	type?: LogVarient;
	options?: LoggerOptions
}