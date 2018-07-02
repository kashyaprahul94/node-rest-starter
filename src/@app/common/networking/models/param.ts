import { IParam, IParamValue } from "../interfaces";

export class Param {

    private key: string;
    private value: IParamValue;

    constructor ( key: string = "", value: IParamValue = "" ) {
        this.key = key;
        this.value = value;
    }

    public getKey (): string {
        return this.key;
    }
    public setKey ( key: string ): Param {
        this.key = key;
        return this;
    }

    public getValue (): IParamValue {
        return this.value;
    }
    public setValue ( value: string ): Param {
        this.value = value;
        return this;
    }

    public build (): IParam {
		return {
			[ this.getKey() ]: this.getValue()
		};
	}
}