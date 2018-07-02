import { Options as RequestOptions } from "request";
import { forEach as Iterator } from "lodash";

import { Header, IHeader, Form, FormData, Params,Param, RequestMethod, HeaderValueType } from "../index";
import { IncomingHttpHeaders } from "http";

type dataValue = any | any[] | null;

export class Request {

    private method: RequestMethod;
    private url: string;
    private params?: Params[];
	private formData?: FormData[];
    private headers?: Header[];
    private headersMap: IHeader;
    private data?: dataValue;

    constructor (
        method: RequestMethod = RequestMethod.Default,
        url: string = "",
        params: Params[] = [],
		formData: FormData[] = [],
        headers: Header[] = [],
        data: dataValue = null
    ) {
        this.method = method;
        this.url = url;
        this.params = params;
        this.formData = formData;
        this.headers = headers;
        this.headersMap = {};
        this.data = data;
    }

    public getMethod (): RequestMethod {
        return this.method
    }
    public setMethod ( method: RequestMethod | string ): Request {
    	if ( typeof method === "string" ) {
			method = method.toLowerCase();
    		if ( method === "get" ) {
    			this.method = RequestMethod.Get
			} else if ( method === "post" ) {
				this.method = RequestMethod.Post
			}  else if ( method === "put" ) {
				this.method = RequestMethod.Put
			}  else if ( method === "delete" ) {
				this.method = RequestMethod.Delete
			}  else if ( method === "patch" ) {
				this.method = RequestMethod.Patch
			}  else if ( method === "head" ) {
				this.method = RequestMethod.Head
			} else {
				this.method = RequestMethod.Default;
			}
		} else {
			this.method = method;
		}
        return this;
    }

    public getURL (): string {
        return this.url
    }
    public setURL ( url: string ): Request {
        this.url = url;
        return this;
    }

    public getParams (): Params[] {
        return this.params
    }
    public setParams ( params: Params[] ): Request {
        this.params = params;
        return this;
    }

	public getFormData (): FormData[] {
		return this.formData
	}
	public setFormData ( formData: FormData[] ): Request {
		this.formData = formData;
		return this;
	}

    public getHeaders (): Header[] {
        return this.headers
    }
    public setHeaders ( headers: Header[] ): Request {
        this.headers = headers;
        this.setHeadersMap();
        return this;
    }
	public setIncomingHeaders ( headers: IncomingHttpHeaders ): Request {
		this.headers = Header.FromIncomingHeaders( headers );
		this.setHeadersMap();
		return this;
	}
	private setHeadersMap (): Request {
    	Iterator( this.headers, ( header: Header ) => {
			this.headersMap[ header.getName() ] = header.getValue();
		});
		return this;
	}
	public header ( name: string ): HeaderValueType {
		return this.headersMap[ name ] || "";
	}

    public getData (): dataValue {
        return this.data
    }
    public setData ( data: dataValue ): Request {
        this.data = data;
        return this;
    }



    public addParam ( param: Params ): Request {
        this.params.push( new Params( param.getKey(), param.getValue() ) );
        return this;
    }
	private buildParams (): Param {
		let result: Param = {};
		this.params.forEach( ( item: Params ) => {
			result[ item.getKey() ] = item.getValue();
		});
		return result;
	}

	public addFormData ( form: FormData ): Request {
		this.formData.push( new FormData( form.getName(), form.getValue() ) );
		return this;
	}
	private buildFormData (): Form {
    	let result: Form = {};
		this.formData.forEach( ( item: FormData ) => {
			result[ item.getName() ] = item.getValue();
		});
		return result;
	}

    public addHeader ( header: Header ): Request {
        this.headers.push( new Header( header.getName(), header.getValue() ) );
        this.headersMap[ header.getName() ] = header.getValue();
        return this;
    }
	private buildHeaders (): IHeader {
		return this.headersMap;
	}

    public build (): RequestOptions {
        return {
        	url: this.getURL(),
			qs: this.buildParams(),
			headers: this.buildHeaders(),
			json: this.getData()
        }
    }
}