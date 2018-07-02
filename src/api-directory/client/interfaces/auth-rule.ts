export interface IAuthPathMethod {
	[ method: string ]: string[]
}

export interface IAuthPath {
	[ path: string ]: IAuthPathMethod
}

export interface IAuthRule {
	[ method: string ]: IAuthPath
}

export type TypeAuthRule = IAuthRule | {};