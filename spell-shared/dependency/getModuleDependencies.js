define(
	'spell-shared/dependency/getModuleDependencies',
	[
		'spell-shared/dependency/createDependencyNode',

		'amd-helper',
		'underscore'
	],
	function(
		createDependencyNode,
		amdHelper,

		_
	) {
		'use strict'


		var generateNode = function( id ) {
			var libraryId = id.replace( /\//g, '.' )

			return createDependencyNode( libraryId, 'script' )
		}

		return function( module ) {
			var moduleHeader = amdHelper.extractModuleHeader( module )

			return _.map(
				moduleHeader.dependencies,
				generateNode
			)
		}
	}
)
