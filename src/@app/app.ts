import { App as Application } from "./instance";

export namespace App {
	export type Type = Application;
	export const Instance: Application = Application.Instance();
}