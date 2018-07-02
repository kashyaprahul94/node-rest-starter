export type IHeaderValue = number | string | string[] | boolean | undefined;

export interface IHeader {
    [ key: string ]: IHeaderValue
}