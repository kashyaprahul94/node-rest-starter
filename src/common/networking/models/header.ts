import { IncomingHttpHeaders } from "http";

export type HeaderValueType = number | string | string[] | boolean | undefined;

export interface IHeader {
    [ key: string ]: HeaderValueType
}

export class Header {

	public static Delimiter: string = ", ";
	private static Exceptions: string[] = [ "host", "connection", "cookie", "content-length" ];

    private name: string;
    private value: HeaderValueType;

    constructor ( name: string = "", value: HeaderValueType = "" ) {
        this.name = name;
        this.value = value;
    }

    public getName (): string {
        return this.name;
    }
    public setName ( name: string ): Header {
        this.name = name;
        return this;
    }

    public getValue (): HeaderValueType {
        return this.value;
    }
    public setValue ( value: HeaderValueType ): Header {
        this.value = value;
        return this;
    }

    public static FromObject ( header: IHeader ): Header {
    	let result: Header = new Header();
		for ( const key in <IHeader>header ) {
			result.setName( key );
			result.setValue( header[ key ] );
		}
		return result;
	}

    public static FromIncomingHeaders ( headers: IHeader | IncomingHttpHeaders ): Header[] {
    	let result: Header[] = [];
		for ( const header in <IHeader>headers ) {
			if ( Header.Exceptions.indexOf( header.toLowerCase() ) < 0 ) {
				result.push( new Header( header, headers[ header ] ) );
			}
		}
		return result;
	}

    public build (): IHeader {
		return {
			[ this.getName() ]: this.getValue()
		};
    }
}