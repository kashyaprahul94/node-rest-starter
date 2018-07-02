import * as Promise from "bluebird";
import * as Redis from "redis";

import { ApplicationClient } from "../models/application-client";
import { ClientErrorFactory, ClientErrors } from "./error";

export class ApplicationRepository {

	private static BaseKey: string = "collection.$$.client.@@.application.##";
	private static MapKey: string = "map.$$.client.@@.application.##";

	private delegate: Redis.RedisClient;

	public constructor ( delegate: Redis.RedisClient ) {
		this.delegate = delegate;
	}

	private static CreateKey ( id: string ): string {
		return [ ApplicationRepository.BaseKey, id ].join( "." );
	};

	private static CreateMapKey ( appName: string ): string {
		return [ ApplicationRepository.MapKey, appName ].join( "." );
	};




	public getClientById ( clientId: string ): Promise<ApplicationClient> {
		return new Promise<ApplicationClient>( ( resolve: ( result: ApplicationClient ) => void, reject: ( error: Error ) => void ) => {
			this.delegate.get( ApplicationRepository.CreateKey( clientId ), ( error: Error, reply: string ) => {
				if ( error || ( ! reply ) ) {
					reject( ClientErrorFactory.Get( ClientErrors.Unknown ) );
				} else {
					resolve( ApplicationClient.deserialize( reply ) );
				}
			});
		});
	}

	public getClientByAppName ( appName: string ): Promise<ApplicationClient> {
		return new Promise<ApplicationClient>( ( resolve: ( result: ApplicationClient ) => void, reject: ( error: Error ) => void ) => {
			this.delegate.get( ApplicationRepository.CreateMapKey( appName ), ( error: Error, reply: string ) => {
				if ( error || ( ! reply ) ) {
					reject( ClientErrorFactory.Get( ClientErrors.Unknown ) );
				} else {
					resolve( ApplicationClient.deserialize( reply ) );
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




	private doCreateClientById ( client: ApplicationClient ): Promise<boolean> {
		return new Promise<boolean>( ( resolve: ( result: boolean ) => void, reject: ( error: Error ) => void ) => {
			this.delegate.set( ApplicationRepository.CreateKey( client.getId() ), client.serialize(), ( error: Error, reply: string ) => {
				if ( error || ( ! reply ) ) {
					reject( ClientErrorFactory.Get( ClientErrors.Unknown ) );
				} else {
					resolve( !!( reply ) );
				}
			});
		});
	}

	private doCreateClientByAppName ( appName: string, client: ApplicationClient ): Promise<boolean> {
		return new Promise<boolean>( ( resolve: ( result: boolean ) => void, reject: ( error: Error ) => void ) => {
			this.delegate.set( ApplicationRepository.CreateMapKey( appName ), client.serialize(), ( error: Error, reply: string ) => {
				if ( error || ( ! reply ) ) {
					reject( ClientErrorFactory.Get( ClientErrors.Unknown ) );
				} else {
					resolve( !!( reply ) );
				}
			});
		});
	}

	public createClient ( client: ApplicationClient ): Promise<boolean> {
		return Promise.all( [
			this.doCreateClientById( client ),
			this.doCreateClientByAppName( client.getURI().getPath(), client )
		])
			.then( () => {
				return true;
			})
		;
	}



	private doUpdateClientById ( client: ApplicationClient ): Promise<boolean> {
		return new Promise<boolean>( ( resolve: ( result: boolean ) => void, reject: ( error: Error ) => void ) => {
			this.delegate.set( ApplicationRepository.CreateKey( client.getId() ), client.serialize(), ( error: Error, reply: string ) => {
				if ( error || ( ! reply ) ) {
					reject( ClientErrorFactory.Get( ClientErrors.Unknown ) );
				} else {
					resolve( !!( reply ) );
				}
			});
		});
	}

	private doUpdateClientByPath ( appName: string, client: ApplicationClient ): Promise<boolean> {
		return new Promise<boolean>( ( resolve: ( result: boolean ) => void, reject: ( error: Error ) => void ) => {
			this.delegate.set( ApplicationRepository.CreateMapKey( appName ), client.serialize(), ( error: Error, reply: string ) => {
				if ( error || ( ! reply ) ) {
					reject( ClientErrorFactory.Get( ClientErrors.Unknown ) );
				} else {
					resolve( !!( reply ) );
				}
			});
		});
	}

	public updateClient ( client: ApplicationClient ): Promise<boolean> {
		return Promise.all( [
			this.doUpdateClientById( client ),
			this.doUpdateClientByPath( client.getURI().getPath(), client )
		])
			.then( () => {
				return true;
			})
		;
	}




	private doDeleteClientById ( clientId: string ): Promise<boolean> {
		return new Promise<boolean>( ( resolve: ( result: boolean ) => void, reject: ( error: Error ) => void ) => {
			this.delegate.del( ApplicationRepository.CreateKey( clientId ), ( error: Error, reply: number ) => {
				if ( error || ( ! reply ) ) {
					reject( ClientErrorFactory.Get( ClientErrors.Unknown ) );
				} else {
					resolve( !!( reply ) );
				}
			})
		});
	}
	private doDeleteClientByAppName ( appName: string ): Promise<boolean> {
		return new Promise<boolean>( ( resolve: ( result: boolean ) => void, reject: ( error: Error ) => void ) => {
			this.delegate.del( ApplicationRepository.CreateMapKey( appName ), ( error: Error, reply: number ) => {
				if ( error || ( ! reply ) ) {
					reject( ClientErrorFactory.Get( ClientErrors.Unknown ) );
				} else {
					resolve( !!( reply ) );
				}
			})
		});
	}

	public deleteClient ( clientId: string, client: ApplicationClient ): Promise<boolean> {
		return Promise.all( [
			this.doDeleteClientById( clientId ),
			this.doDeleteClientByAppName( client.getURI().getPath() )
		])
			.then( () => {
				return Promise.resolve( true );
			})
		;
	}
}