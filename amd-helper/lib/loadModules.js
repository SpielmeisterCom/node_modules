var loadModule = require( './loadModule' ),
	fs         = require( 'fs' ),
	wrench     = require( 'wrench' ),
	path       = require( 'path' ),
	pathUtil   = require( 'pathUtil' ),
	_          = require( 'underscore' )

module.exports = function( basePath ) {
	var filter = function( x ) {
		return _.last( x.split( '.' ) ) == 'js'
	}

	var jsFilePaths = pathUtil.createPathsFromDirSync(
		basePath,
		filter,
		{
			absolute : true
		}
	)

	return _.reduce(
		jsFilePaths,
		function( memo, filePath ) {
			var module = loadModule( filePath )

			if( module ) {
				memo[ module.name ] = _.pick( module, [ 'dependencies', 'source', 'path' ] )
			}

			return memo
		},
		{}
	)
}
