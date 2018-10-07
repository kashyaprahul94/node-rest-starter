const Path = require( "path" );
const RootPath = require( "app-root-path" );


module.exports = {
	
	root: ( ...args ) => {
		return RootPath.resolve( Path.join( ...args ) );
	}
};