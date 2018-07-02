import { Config as IConfig } from "@sap/loyalty/api-directory/client";

export class ServiceBroker {

	protected instanceId: string;
	protected serviceId: string;
	protected planId: string;
	protected organizationId: string;
	protected spaceId: string;
	protected bindingId: string;
	protected parameters: any;

	constructor (  ) {

	}

	public getInstanceId (): string {
		return this.instanceId;
	}
	public setInstanceId ( instanceId: string ): ServiceBroker {
		this.instanceId = instanceId;
		return this;
	}

	public getServiceId (): string {
		return this.serviceId;
	}
	public setServiceId ( serviceId: string ): ServiceBroker {
		this.serviceId = serviceId;
		return this;
	}

	public getPlanId (): string {
		return this.planId;
	}
	public setPlanId ( planId: string ): ServiceBroker {
		this.planId = planId;
		return this;
	}

	public getOrganizationId (): string {
		return this.organizationId;
	}
	public setOrganizationId ( organizationId: string ): ServiceBroker {
		this.organizationId = organizationId;
		return this;
	}

	public getSpaceId (): string {
		return this.spaceId;
	}
	public setSpaceId ( spaceId: string ): ServiceBroker {
		this.spaceId = spaceId;
		return this;
	}

	public getBindingId (): string {
		return this.bindingId;
	}
	public setBindingId ( bindingId: string ): ServiceBroker {
		this.bindingId = bindingId;
		return this;
	}

	public getParameters (): IConfig {
		return this.parameters;
	}
	public setParameters ( parameters: IConfig ): ServiceBroker {
		this.parameters = parameters;
		return this;
	}

}