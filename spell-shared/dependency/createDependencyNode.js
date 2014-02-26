define(
	'spell-shared/dependency/createDependencyNode',
	function() {
		'use strict'

		return function( id, type ) {

			return { libraryId: id, id: id, type: type, isStatic: true }
		}
	}
)
