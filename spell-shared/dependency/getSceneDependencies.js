define(
	'spell-shared/dependency/getSceneDependencies',
	[
		'spell-shared/dependency/createDependencyNode',
		'spell-shared/dependency/getEntityConfigDependencies',

		'underscore'
	],
	function(
		createDependencyNode,
		getEntityConfigDependencies,

		_
	) {
		'use strict'


		return function( scene ) {
			var dependencies = []

			_.each(
				scene.systems,
				function( value ) {
					_.each(
						value,
						function( system ) {
							dependencies.push( createDependencyNode( system.id, 'system' ) )
						}
					)
				}
			)

			var entityConfigDependencies = [],
				anonymousEntityNode      = createDependencyNode( 'Anonymous', 'entity' )

			_.each(
				scene.entities,
				function( entity ) {
					if( entity.entityTemplateId ) {
						dependencies.push( createDependencyNode( entity.entityTemplateId, 'entity' ) )
					}

					entityConfigDependencies = entityConfigDependencies.concat( getEntityConfigDependencies( entity, true ) )
				}
			)

			if( entityConfigDependencies.length > 0 ) {
				var children = []

				_.each(
					entityConfigDependencies,
					function( node ) {
						children.push( node )
					}
				)

				anonymousEntityNode.children = children
				dependencies.push( anonymousEntityNode )
			}

			return _.uniq( dependencies )
		}
	}
)
