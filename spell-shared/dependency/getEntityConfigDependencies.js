define(
	'spell-shared/dependency/getEntityConfigDependencies',
	[
		'spell-shared/dependency/createDependencyNode',

		'underscore'
	],
	function(
		createDependencyNode,

		_
	) {
		'use strict'


		var parseEntityConfig = function( entityConfig ) {
			var dependencies = []

			_.each(
				entityConfig,
				function( value, key ) {
					dependencies.push( createDependencyNode( key, 'component' ) )
					//TODO: parse cmp config overload for example on assetId
				}
			)

			return dependencies
		}

		return function( entity, isAnonymous ) {
			var dependencies    = parseEntityConfig( entity.config ),
				alreadyExisting = {},
				components      = []

			_.each(
				entity.children,
				function( childEntity ) {
					var templateId = childEntity.entityTemplateId

					if( templateId && !alreadyExisting[ templateId ]) {
						dependencies.push( createDependencyNode( templateId, 'entity' ) )
						alreadyExisting[ templateId ] = true
					}

					//Add all component config as additional info. Because templates will ask the server explicit for their definition
					components = components.concat( parseEntityConfig( childEntity.config ) )
				}
			)

			if( components.length > 0 ) {
				var nodes = _.uniq(
					components,
					function( componentNode ) {
						//TODO: filter known components and add different children
						//TODO: same cmp with different config should be detected and maybe create some children also
						return JSON.stringify( componentNode )
					}
				)

				if( !isAnonymous ) {
					var anonymous = createDependencyNode( 'Anonymous', 'entity' )
					anonymous.children = nodes
					dependencies.push( anonymous )

				} else {
					dependencies = dependencies.concat( nodes )
				}

			}

			return dependencies
		}
	}
)
