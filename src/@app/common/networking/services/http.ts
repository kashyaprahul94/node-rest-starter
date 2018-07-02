import Axios, { AxiosInstance } from "axios";

import { Request, Response } from "../models";

export class HttpClient {

    private delegate: AxiosInstance;

    public constructor () {
        this.delegate = Axios.create();
    }


	public get ( request: Request ): Promise<Response> {
    	return this.delegate.get( request.getURL(), request.build() )
			.then( Response.Create )
		;
	}

	public post ( request: Request ): Promise<Response> {
    	return this.delegate.post( request.getURL(), request.getData(), request.build() )
			.then( Response.Create )
		;
	}

	public put ( request: Request ): Promise<Response> {
    	return this.delegate.put( request.getURL(), request.getData(), request.build() )
			.then( Response.Create )
		;
	}

	public patch ( request: Request ): Promise<Response> {
    	return this.delegate.patch( request.getURL(), request.getData(), request.build() )
			.then( Response.Create )
		;
	}

	public delete ( request: Request ): Promise<Response> {
		return this.delegate.delete( request.getURL(), request.build() )
			.then( Response.Create )
		;
	}



}