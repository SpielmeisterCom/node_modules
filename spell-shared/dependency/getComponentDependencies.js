define(
	'spell-shared/dependency/getComponentDependencies',
	[
		'spell-shared/dependency/createDependencyNode',
		'underscore'
	],
	function(
		createDependencyNode,
		_
	) {
		'use strict'

		var getAssetType = function( type ) {
			var parts = !_.isEmpty( type ) && _.isString( type ) ? type.split( ":" ) : []

			if( parts.length > 1 && parts[0] === 'assetId' ) {
				return parts[1]
			} else {
				return null
			}
		}

		return function( component ) {
			var dependencies = []

			_.each(
				component.attributes,
				function( attribute ) {
					var type = getAssetType( attribute.type )

					if( type ) {
						var libraryId = _.has( attribute, 'default' ) && _.isString( attribute.default ) ? attribute.default.split( type + ':' ).pop() : null

						if( libraryId ) {
							dependencies.push( createDependencyNode( libraryId, type ) )
						}
					}
				}
			)

			return dependencies
		}
	}
)
