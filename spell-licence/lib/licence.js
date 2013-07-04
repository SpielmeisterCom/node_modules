var _      = require( 'underscore'),
	crypto = require( 'crypto' )


var	FORMAT_VERSION          = '01',
	FORMAT_VERSION_OFFSET   = 0,
	FORMAT_VERSION_LENGTH   = 2,
	SIGNATURE_LENGTH_OFFSET = 0,
	SIGNATURE_LENGTH_LENGTH = 4,
	SIGNATURE_OFFSET        = SIGNATURE_LENGTH_OFFSET + SIGNATURE_LENGTH_LENGTH,
	MAX_LINE_LENGTH         = 64

/**
 * Creates a string representation of the numer of supplied length.
 *
 * @param number
 * @param length
 * @return {String}
 */
var createPaddedNumber = function( number, length ) {
	var result = '' + number

	while( result.length < length ) {
		result = '0' + result
	}

	return result
}

/**
 * Adds licence header and footer.
 *
 * @param rawLicence
 */
var wrap = function( rawLicence ) {
	// add header and footer and break licence into lines of MAX_LINE_LENGTH length
	var numLines = Math.ceil( rawLicence.length / MAX_LINE_LENGTH ),
		lines    = [ '-----BEGIN LICENCE KEY-----' ]

	for( var i = 0, from, until, n = numLines; i < n; i++ ) {
		from  = i * MAX_LINE_LENGTH
		until = i + 1 < n ? from + MAX_LINE_LENGTH : undefined

		lines.push( rawLicence.slice( from, until ) )
	}

	lines.push( '-----END LICENCE KEY-----' )

	return lines.join( '\n' )
}

/**
 * Removes licence header and footer.
 *
 * @param licence
 */
var unwrap = function( licence ) {
	var lines = _.filter(
		licence.split( '\n' ),
		function( line ) {
			return line != ''
		}
	)

	var rawLicence = ''

	if( lines.length < 3 ) {
		console.error( 'Error: Lincence is corrupted.' )
		process.exit( 1 )
	}

	for( var i = 1, n = lines.length - 1; i < n; i++ ) {
		rawLicence += lines[ i ]
	}

	return rawLicence
}

var serialize = function( privateKey, version, payload ) {
	var payloadSerialized = JSON.stringify( payload )

	var signature = crypto.createSign( 'DSS1' )
		.update( payloadSerialized )
		.sign( privateKey, 'hex' )

	var buffer = new Buffer( createPaddedNumber( signature.length, SIGNATURE_LENGTH_LENGTH ) + signature + payloadSerialized )

	return wrap( version + buffer.toString( 'base64' ) )
}

var parse = function( licence ) {
	var rawLicence        = unwrap( licence ),
		version           = rawLicence.slice( FORMAT_VERSION_OFFSET, FORMAT_VERSION_LENGTH ),
		contentBase64     = rawLicence.slice( FORMAT_VERSION_LENGTH ),
		content           = new Buffer( contentBase64, 'base64' ).toString(),
		signatureLength   = parseInt( content.slice( SIGNATURE_LENGTH_OFFSET, SIGNATURE_LENGTH_LENGTH ), 10 ),
		signature         = content.slice( SIGNATURE_OFFSET, SIGNATURE_OFFSET + signatureLength ),
		payloadSerialized = content.slice( SIGNATURE_OFFSET + signatureLength )

	return {
		signature : signature,
		payloadSerialized : payloadSerialized
	}
}

/**
 * Creates a licence data string.
 *
 * @param privateKey
 * @param payload {Object}
 * @return {String}
 */
var create = function( privateKey, payload ) {
	if( !privateKey ) {
		throw 'Error: "privateKey" is undefined.'
	}

	if( !payload ) {
		throw 'Error: "payload" is undefined.'
	}

	if( !_.isObject( payload ) ) {
		throw 'Error: "payload" must be of type "object".'
	}

	return serialize( privateKey, FORMAT_VERSION, payload )
}

/**
 * Verifies that the licence data string was signed with the supplied key.
 *
 * @param publicKey
 * @param licenceData
 * @return {*}
 */
var verify = function( publicKey, licenceData ) {
	if( !publicKey ) {
		throw 'Error: "publicKey" is undefined.'
	}

	var licence = parse( licenceData )

	var isValid = crypto.createVerify( 'DSS1' )
		.update( licence.payloadSerialized )
		.verify( publicKey, licence.signature, 'hex' )

	return isValid
}

/**
 * Returns the payload contained in a licence data string.
 *
 * @param licenceData
 * @return {*}
 */
var createPayload = function( licenceData ) {
	return JSON.parse( parse( licenceData ).payloadSerialized )
}

module.exports = {
	create : create,
	createPayload : createPayload,
	verify : verify
}
