export class URLUtils {

	public constructor () {

	}

	public static Normalize ( input: string ): string {
		return input.replace(/([^:]\/)\/+/g, "$1" );
	}

	public static NormalizeEnd ( input: string ): string {
		return ( new RegExp("\/$" ).test( input ) ) ? input.slice( 0, -1 ) : input;
	}

	public static MatchWildCardRoute ( input: string ): RegExp | string {
		return `^${ input.replace( /\*/g, "([a-zA-Z0-9-]+)" ) }(\/*?)$`;
	}
	public static CanMatchWildCardRoute ( input: string, target: string ): boolean {
		return new RegExp( this.MatchWildCardRoute( input ) ).test( target )
	}
}