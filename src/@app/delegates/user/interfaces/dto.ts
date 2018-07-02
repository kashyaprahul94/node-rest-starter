import { IBaseAPIRequest } from "@app/common/api";

export interface UserRequest extends IBaseAPIRequest {
	body: {
		name: string;
	},
	params: {
		id: string;
	}
}