import { App as Application } from "./instance";

export type AppType = Application;
export const AppInstance: Application = Application.Instance();

export interface IApp {
	Boot(): Promise<AppType>
}