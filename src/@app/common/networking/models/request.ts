import { AxiosRequestConfig } from "axios";

import { Method } from "../enums";
import { IParam, IHeader } from "../interfaces";
import { Param, Header } from "../models";

type IData = any | any[] | null;


export class Request {

    private method: Method;
    private url: string;
    private params?: IParam;
	private headers?: IHeader;
	private data?: IData;

    constructor ( method: Method = Method.GET, url: string = "", params: IParam = null, headers: IHeader = null, data: IData = null ) {
        this.method = method;
        this.url = url;
        this.params = params;
        this.headers = headers;
        this.data = data;
    }

    public getMethod (): Method {
        return this.method
    }
    public setMethod ( method: Method ): Request {
		this.method = method;
        return this;
    }

    public getURL (): string {
        return this.url
    }
    public setURL ( url: string ): Request {
        this.url = url;
        return this;
    }

    public getParams (): IParam {
        return this.params
    }
    public setParams ( params: IParam ): Request {
        this.params = params;
        return this;
    }

    public getHeaders (): IHeader {
        return this.headers
    }
    public setHeaders ( headers: IHeader ): Request {
        this.headers = headers;
        return this;
    }

    public getData (): IData {
        return this.data
    }
    public setData ( data: IData ): Request {
        this.data = data;
        return this;
    }



    public addParam ( param: Param ): Request {
    	this.params[ param.getKey() ] = param.getValue();
        return this;
    }
    public addHeader ( header: Header ): Request {
		this.headers[ header.getName() ] = header.getValue();
        return this;
    }

    public build (): AxiosRequestConfig {
        return {
			method: this.method,
        	url: this.getURL(),
        	params: this.getParams(),
			headers: this.getHeaders(),
			data: this.getData()
        }
    }
}