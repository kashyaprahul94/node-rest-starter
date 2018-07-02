import * as Process from "process";
import * as Promise from "bluebird";

import { Config } from "@app-config";

import { Server } from "@app/common/api/server";

export class App {

	private static _Instance: App = null;

	private readonly config: Config;

	private readonly server: Server;


	private constructor () {

		this.config = Config.Instance();

		this.server = new Server();
	}

	public static Instance (): App {
		if ( ! App._Instance ) {
			App._Instance = new App();
		}
		return App._Instance;
	}

	public getConfig (): Config {
		return this.config;
	}





	private startServer = ( port?: number, hostname?: string, prefix?: string ): Server => {
		return this.server
			.withPort( port || this.config.appPort )
			.asHostname( hostname || this.config.appHost )
			.withPrefix( prefix || this.config.mountPoint )
			.boot()
		;
	};


	public init (): Promise<void> {
		return Promise.all( [

		])
			.spread( () => {

				Process.on( "uncaughtException", this.onUncaughtError );
			})
		;
	}

	public getServerInstance = (): Promise<Server> => {
		return Promise.resolve( this.server );
	};

	public start ( port?: number, hostname?: string, prefix?: string ): Promise<App> {
		return Promise.all([
			this.startServer( port, hostname, prefix )
		])
			.then( () => {
				return Promise.resolve( this );
			})
		;
	}


	private onUncaughtError = ( error: Error ): void => {
		console.info( "Uncaught Error : ", error );
	};
}