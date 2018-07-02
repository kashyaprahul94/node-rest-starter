import * as Promise from "bluebird";
import * as Redis from "redis";

import { ServiceClient } from "../models/service-client";
import { ClientErrorFactory, ClientErrors } from "./error";

export class ServiceRepository {

	private static BaseKey: string = "collection.$$.client.@@.service.##";
	private static MapKey: string = "map.$$.client.@@.service.##";

	private delegate: Redis.RedisClient;

	public constructor ( delegate: Redis.RedisClient ) {
		this.delegate = delegate;
	}

	private static CreateKey ( id: string ): string {
		return [ ServiceRepository.BaseKey, id ].join( "." );
	};

	private static CreateMapKey ( path: string, version: string ): string {
		return [ ServiceRepository.MapKey, path, version ].join( "." );
	};




	public getClientById ( clientId: string ): Promise<ServiceClient> {
		return new Promise<ServiceClient>( ( resolve: ( result: ServiceClient ) => void, reject: ( error: Error ) => void ) => {
			this.delegate.get( ServiceRepository.CreateKey( clientId ), ( error: Error, reply: string ) => {
				if ( error || ( ! reply ) ) {
					reject( ClientErrorFactory.Get( ClientErrors.Unknown ) );
				} else {
					resolve( ServiceClient.deserialize( reply ) );
				}
			});
		});
	}

	public getClientByPath ( path: string, version: string ): Promise<ServiceClient> {
		return new Promise<ServiceClient>( ( resolve: ( result: ServiceClient ) => void, reject: ( error: Error ) => void ) => {
			this.delegate.get( ServiceRepository.CreateMapKey( path, version ), ( error: Error, reply: string ) => {
				if ( error || ( ! reply ) ) {
					reject( ClientErrorFactory.Get( ClientErrors.Unknown ) );
				} else {
					resolve( ServiceClient.deserialize( reply ) );
				}
			});
		});
	}


	public clientExists ( clientId: string ): Promise<boolean> {
		return this.getClientById( clientId ).then( () => {
			return Promise.resolve( true );
		}, () => {
			return Promise.reject( ClientErrorFactory.Get( ClientErrors.NotFound ) );
		});
	}

	public isUniqueClient ( clientId: string ): Promise<boolean> {
		return this.getClientById( clientId ).then( () => {
			return Promise.reject( ClientErrorFactory.Get( ClientErrors.Conflict ) );
		}, () => {
			return Promise.resolve( true );
		});
	}




	private doCreateClientById ( client: ServiceClient ): Promise<boolean> {
		return new Promise<boolean>( ( resolve: ( result: boolean ) => void, reject: ( error: Error ) => void ) => {
			this.delegate.set( ServiceRepository.CreateKey( client.getId() ), client.serialize(), ( error: Error, reply: string ) => {
				if ( error || ( ! reply ) ) {
					reject( ClientErrorFactory.Get( ClientErrors.Unknown ) );
				} else {
					resolve( !!( reply ) );
				}
			});
		});
	}

	private doCreateClientByPath ( path: string, version: string, client: ServiceClient ): Promise<boolean> {
		return new Promise<boolean>( ( resolve: ( result: boolean ) => void, reject: ( error: Error ) => void ) => {
			this.delegate.set( ServiceRepository.CreateMapKey( path, version ), client.serialize(), ( error: Error, reply: string ) => {
				if ( error || ( ! reply ) ) {
					reject( ClientErrorFactory.Get( ClientErrors.Unknown ) );
				} else {
					resolve( !!( reply ) );
				}
			});
		});
	}

	public createClient ( client: ServiceClient ): Promise<boolean> {
		return Promise.all( [
			this.doCreateClientById( client ),
			this.doCreateClientByPath( client.getURI().getPath(), client.getURI().getVersion(), client )
		])
			.then( () => {
				return true;
			})
		;
	}



	private doUpdateClientById ( client: ServiceClient ): Promise<boolean> {
		return new Promise<boolean>( ( resolve: ( result: boolean ) => void, reject: ( error: Error ) => void ) => {
			this.delegate.set( ServiceRepository.CreateKey( client.getId() ), client.serialize(), ( error: Error, reply: string ) => {
				if ( error || ( ! reply ) ) {
					reject( ClientErrorFactory.Get( ClientErrors.Unknown ) );
				} else {
					resolve( !!( reply ) );
				}
			});
		});
	}

	private doUpdateClientByPath ( path: string, version: string, client: ServiceClient ): Promise<boolean> {
		return new Promise<boolean>( ( resolve: ( result: boolean ) => void, reject: ( error: Error ) => void ) => {
			this.delegate.set( ServiceRepository.CreateMapKey( path, version ), client.serialize(), ( error: Error, reply: string ) => {
				if ( error || ( ! reply ) ) {
					reject( ClientErrorFactory.Get( ClientErrors.Unknown ) );
				} else {
					resolve( !!( reply ) );
				}
			});
		});
	}

	public updateClient ( client: ServiceClient ): Promise<boolean> {
		return Promise.all( [
			this.doUpdateClientById( client ),
			this.doUpdateClientByPath( client.getURI().getPath(), client.getURI().getVersion(), client )
		])
			.then( () => {
				return true;
			})
		;
	}





	private doDeleteClientById ( clientId: string ): Promise<boolean> {
		return new Promise<boolean>( ( resolve: ( result: boolean ) => void, reject: ( error: Error ) => void ) => {
			this.delegate.del( ServiceRepository.CreateKey( clientId ), ( error: Error, reply: number ) => {
				if ( error || ( ! reply ) ) {
					reject( ClientErrorFactory.Get( ClientErrors.Unknown ) );
				} else {
					resolve( !!( reply ) );
				}
			})
		});
	}
	private doDeleteClientByPath ( path: string, version: string ): Promise<boolean> {
		return new Promise<boolean>( ( resolve: ( result: boolean ) => void, reject: ( error: Error ) => void ) => {
			this.delegate.del( ServiceRepository.CreateMapKey( path, version ), ( error: Error, reply: number ) => {
				if ( error || ( ! reply ) ) {
					reject( ClientErrorFactory.Get( ClientErrors.Unknown ) );
				} else {
					resolve( !!( reply ) );
				}
			})
		});
	}

	public deleteClient ( clientId: string, client: ServiceClient ): Promise<boolean> {
		return Promise.all( [
			this.doDeleteClientById( clientId ),
			this.doDeleteClientByPath( client.getURI().getPath(), client.getURI().getVersion() )
		])
			.then( () => {
				return Promise.resolve( true );
			})
		;
	}
}