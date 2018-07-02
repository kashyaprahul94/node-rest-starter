type paramValueType = number | string | boolean;

export interface Param {
	[ key: string ]: paramValueType
}

export class Params {

    private key: string;
    private value: paramValueType;

    constructor ( key: string = "", value: paramValueType = "" ) {
        this.key = key;
        this.value = value;
    }

    public getKey (): string {
        return this.key;
    }
    public setKey ( key: string ): Params {
        this.key = key;
        return this;
    }

    public getValue (): paramValueType {
        return this.value;
    }
    public setValue ( value: string ): Params {
        this.value = value;
        return this;
    }

    public build (): Param {
    	let params: Param;
		params[ this.getKey() ] = this.getValue();
    	return params;
	}
}