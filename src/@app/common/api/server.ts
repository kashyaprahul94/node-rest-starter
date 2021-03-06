import * as Express from "express";
import * as BodyParser from "body-parser";
import * as CORS from "cors";
import * as Helmet from "helmet";
import * as Compression from "compression";


import { LoggerFactory, ILogger } from "@app/common/logger";

import { APIRoute } from "./interfaces";

export class Server {

	private static DefaultPort: number = 3099;
	private static DefaultHost: string = "localhost";
	private static DefaultMount: string = "/";

    private port: number;
    private hostname: string;
    private prefix: string;

	private readonly instance: Express.Application;
	private readonly router: Express.Router;

    private routes: APIRoute[];

    private logger: ILogger;

    constructor ( port?: number, hostname?: string, prefix?: string ) {

		this.port = port || Server.DefaultPort;
		this.hostname = hostname || Server.DefaultHost;
		this.prefix = prefix || Server.DefaultMount;

        this.instance = Express();
        this.router = Express.Router();

        this.routes = [];

		this.logger = LoggerFactory.Instance({
			options: {
				shouldLogTime: true,
				decorator: "HTTP Server",
			}
		});

        this.init();
    }

    public withPort ( port: number ): Server {
        this.port = port;
        return this;
    }
    public asHostname ( hostname: string ): Server {
        this.hostname = hostname;
        return this;
    }
    public withPrefix ( prefix: string ): Server {
        this.prefix = prefix;
        return this;
    }

    public getPort (): number {
    	return this.port;
	}
	public getHost (): string {
    	return this.hostname;
	}





	public attach = ( middleware: Express.Handler | Express.ErrorRequestHandler ): Server => {
		this.instance.use( middleware );
    	return this;
	};
	public addRoute = ( route: APIRoute | APIRoute[] ): Server => {
		this.routes = this.routes.concat( route );
		return this;
	};


	private attachRoute = ( route: APIRoute ): Server => {
		if ( route.middleware ) {
			this.router.use( route.path, route.middleware() );
		}
    	return this;
	};
	private attachRoutes (): Server {
    	this.routes.forEach( this.attachRoute );
    	return this;
	}
	private attachErrorHandlers (): Server {
		return this;
	}

	private mountRoutes (): Server {
		this.instance.use( this.prefix, this.router );
		return this;
	}
	private mountMiddlewares (): Server {
		return this.attachErrorHandlers();
	}




	private init (): Server {
		return this
			.attach( BodyParser.json() )
			.attach( BodyParser.urlencoded({
				extended: true
			}) )
			.attach( CORS() )
			.attach( Helmet() )
			.attach( Compression() )
		;
	}

	private onServerStarted = (): void => {
		this.logger.info( "Server is listening at http://%s:%d", this.hostname, this.port );
	};

	private ignite (): Server {
		this.instance.listen( this.port, this.hostname, this.onServerStarted );
		return this;
	}

    public boot = (): Server => {
        return this
			.attachRoutes()
			.mountRoutes()
			.mountMiddlewares()
			.ignite()
		;
    }
}