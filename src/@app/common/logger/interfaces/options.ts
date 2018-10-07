import { LogLevel } from "../enums";

export interface LoggerOptions {
	shouldLogTime?: boolean;
	decorator?: string;
	defaultLevel?: LogLevel;
}

export const DefaultLoggerOptions: LoggerOptions = {
	shouldLogTime: false,
	decorator: "",
	defaultLevel: LogLevel.Default
};