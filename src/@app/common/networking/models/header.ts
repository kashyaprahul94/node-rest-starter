import { IHeader, IHeaderValue } from "../interfaces";

export class Header {

    private name: string;
    private value: IHeaderValue;

    constructor ( name: string = "", value: IHeaderValue = "" ) {
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

    public getValue (): IHeaderValue {
        return this.value;
    }
    public setValue ( value: IHeaderValue ): Header {
        this.value = value;
        return this;
    }

    public build (): IHeader {
		return {
			[ this.getName() ]: this.getValue()
		};
    }
}