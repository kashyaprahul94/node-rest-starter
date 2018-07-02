import * as CacheManager from "node-cache";
import { Observable } from "rxjs/Observable";

import { Logger } from "@sap/loyalty/common/logger";

import { ClientEventManager, ClientEventsType, IApplicationClientSubject } from "./events";
import { ClientErrorFactory, ClientErrors } from "./error";
import { ApplicationClient } from "../models/application-client";


export class ApplicationCacheManager {

	private cacheManager: CacheManager;
	private static DelimiterKey: string = "_client_application_";

	private static _Instance: ApplicationCacheManager = null;

	private constructor () {

		this.cacheManager = new CacheManager({
			checkperiod: 0,
			stdTTL: 0
		});

		ClientEventManager.ApplicationClientObserver.subscribe( this.onClientChanged );
	}

	public static Instance (): ApplicationCacheManager {
		if ( ! ApplicationCacheManager._Instance ) {
			ApplicationCacheManager._Instance = new ApplicationCacheManager();
		}
		return ApplicationCacheManager._Instance;
	}




	private static GetCacheKey ( appName: string ): string {
		return [ ".", appName, "." ].join( ApplicationCacheManager.DelimiterKey );
	}


	public getClient ( appName: string ): Observable<ApplicationClient> {
		Logger.Info( "Trying to Serve Application Client from Cache" );
		const result: ApplicationClient | undefined = this.cacheManager.get( ApplicationCacheManager.GetCacheKey( appName ) );
		return result ? Observable.of( result ): Observable.throw( ClientErrorFactory.Get( ClientErrors.NotFound ) );
	}

	private createClient ( appName: string, client: ApplicationClient ): Observable<boolean> {
		Logger.Info( "Trying to Creating Application Client to Cache" );
		const result: boolean = this.cacheManager.set( ApplicationCacheManager.GetCacheKey( appName ), client );
		return result ? Observable.of( result ): Observable.throw( ClientErrorFactory.Get( ClientErrors.Unknown ) );
	}

	private updateClient ( appName: string, client: ApplicationClient ): Observable<boolean> {
		Logger.Info( "Trying to Update Application Client to Cache" );
		const result: boolean = this.cacheManager.set( ApplicationCacheManager.GetCacheKey( appName ), client );
		return result ? Observable.of( result ): Observable.throw( ClientErrorFactory.Get( ClientErrors.Unknown ) );
	}

	private deleteClient ( appName: string ): Observable<number> {
		Logger.Info( "Deleting Application Client from Cache" );
		const result: number = this.cacheManager.del( ApplicationCacheManager.GetCacheKey( appName ) );
		return result ? Observable.of( result ): Observable.throw( ClientErrorFactory.Get( ClientErrors.NotFound ) );
	}



	private onClientCreated = ( client: ApplicationClient ) => {
		this.createClient( client.getURI().getPath(), client );
	};
	private onClientUpdated = ( client: ApplicationClient ) => {
		this.updateClient( client.getURI().getPath(), client );
	};
	private onClientDeleted = ( client: ApplicationClient ) => {
		this.deleteClient( client.getURI().getPath() );
	};


	private onClientChanged = ( source: IApplicationClientSubject ) => {
		if ( source.type === ClientEventsType.Created ) {
			this.onClientCreated( source.client );
		} else if ( source.type === ClientEventsType.Updated ) {
			this.onClientUpdated( source.client );
		} else if ( source.type === ClientEventsType.Deleted ) {
			this.onClientDeleted( source.client );
		}
	};
}