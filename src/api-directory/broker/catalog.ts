import * as _ from "lodash";



export interface ICatalogServicePlan {
	id: string,
	name: string,
	description: string,
	displayName: string,
	metadata: any
}


export interface ICatalogService {
	id: string,
	name: string,
	description: string,
	bindable: boolean,
	requires: string[],
	tags: string[],
	metadata: any,
	plans: ICatalogServicePlan[]
}


export interface ICatalog {
	services: ICatalogService[]
}


export const enum CatalogPlan {
	Service,
	Application,
	Unknown,
}


export class Catalog {

	private catalog: ICatalog;

	public constructor ( catalog: ICatalog ) {
		this.catalog = catalog;
	}

	public items (): ICatalog {
		return this.catalog;
	}

	public whichPlan ( planId: string ): CatalogPlan {
		const result: string = _(
			_.flatMap( this.catalog.services, ( service: ICatalogService ) =>
				_( service.plans )
					.filter({ id: planId })
					.map( plan => plan.name )
					.value()
			)).first();
		return (
			( result === "service" ) ? CatalogPlan.Service : (
				( result === "application" ) ? CatalogPlan.Application : CatalogPlan.Unknown
			)
		);
	}

}