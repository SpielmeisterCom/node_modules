var path   = require( 'path' ),
	wrench = require( 'wrench' ),
	_      = require( 'underscore' )

module.exports = {
	/**
	 * Creates a list of paths of descendents of basePath.
	 *
	 * @param basePath the base path
	 * @param filter the filter used for filtering the paths
	 * @param mode can be "absolute", "relative" or "include-base-path"; the default is "relative"
	 * @return {*}
	 */
	createPathsFromDirSync : function( basePath, filter, mode ) {
	//	console.log( 'process.cwd(): ' + process.cwd() )
	//	console.log( 'dirPath: ' + basePath )
	//	console.log( 'path.relative( process.cwd(), sourcePath ): ' + path.relative( process.cwd(), basePath ) )

		mode = mode ? mode : 'relative'

		var tmp  = wrench.readdirSyncRecursive( path.relative( process.cwd(), basePath ) )

		if( mode == 'absolute' ) {
			tmp = _.map(
				tmp,
				function( x ) {
					return path.join( basePath, x )
				}
			)

		} else if( mode == 'include-base-path' ) {
			var baseName = _.last( basePath.split( path.sep ) )

			tmp = _.map(
				tmp,
				function( x ) {
					return path.join( baseName, x )
				}
			)
		}

		return filter ?
			_.filter( tmp, filter ) :
			tmp
	}
}
