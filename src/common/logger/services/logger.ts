const delegate = require( "cf-nodejs-logging-support" );
import { Request, Response, NextFunction } from "express";

import { Utils } from "@sap/loyalty/common/utilities";

import { LogLevel } from "../enums/log-levels";

export class Logger {

	private static DefualtLogLevel: LogLevel = LogLevel.Defualt;

	public constructor () {

	}


	public static WithLevel = ( level: LogLevel ) => {
		Logger.DefualtLogLevel = level;
		delegate.setLoggingLevel( level );
		return Logger;
	};

	public static LogNetwork = ( req: Request, res: Response, next: NextFunction ): void => {
		if ( Utils.IsProduction() ) {
			delegate.logNetwork( req, res, next );
		} else {
			next();
		}
	};


	private static DoLog ( type: LogLevel = Logger.DefualtLogLevel, args: any[] ): void {
		if ( Utils.IsProduction() ) {
			delegate.logMessage( type, ...args );
		} else {
			console.info.apply( console, args );
		}
	};

	public static Info = ( ...args: any[] ): void => {
		Logger.DoLog( LogLevel.Info, args );
	};

	public static Warn = ( ...args: any[] ): void => {
		Logger.DoLog( LogLevel.Warn, args );
	};

	public static Error = ( ...args: any[] ): void => {
		Logger.DoLog( LogLevel.Error, args );
	};

	public static Success = ( ...args: any[] ): void => {
		Logger.DoLog( LogLevel.Success, args );
	};
}