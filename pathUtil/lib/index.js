var path   = require( 'path' ),
	wrench = require( 'wrench' ),
	_      = require( 'underscore' )

/**
 * Creates a list of paths of descendents of basePath.
 *
 * @param basePath the base path
 * @param filter the filter used for filtering the paths
 * @param mode can be "absolute", "relative" or "include-base-path"; the default is "relative"
 * @return {*}
 */
var createPathsFromDirSync = function( basePath, filter, mode ) {
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

/**
 * Creates a list of file paths whose file extensions match one in the provided extensions list.
 *
 * @param basePath
 * @param extensions
 * @param mode
 * @return {*}
 */
var createFilePathsFromDirSync = function( basePath, extensions, mode ) {
	if( _.isArray( extensions ) ) {
		var filter = function( x ) {
			var extension = _.last( x.split( '.' ) )

			return _.contains( extensions, extension )
		}
	}

	return createPathsFromDirSync( basePath, filter, mode )
}

module.exports = {
	createPathsFromDirSync : createPathsFromDirSync,
	createFilePathsFromDirSync : createFilePathsFromDirSync
}
