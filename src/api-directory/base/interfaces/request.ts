import { Request } from "express";
import { ServiceBroker } from "../models";

export interface ExtendedRequest extends Request {
	serviceBroker: ServiceBroker;
}