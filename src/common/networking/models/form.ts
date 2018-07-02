export interface Form {
	[ key: string ]: any
}

export class FormData {

	private name: string;
	private value: string;

	constructor ( name: string = "", value: string = "" ) {
		this.name = name;
		this.value = value;
	}

	public getName (): string {
		return this.name;
	}
	public setName ( name: string ): FormData {
		this.name = name;
		return this;
	}

	public getValue (): string {
		return this.value;
	}
	public setValue ( value: string ): FormData {
		this.value = value;
		return this;
	}

	public build (): Form {
		let formData: Form;
		formData[ this.getName() ] = this.getValue();
		return formData;
	}
}