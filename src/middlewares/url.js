// @ts-nocheck
import User from '../models/user';

const dataUser = async ( req, res, next, user ) => {
	const { password } = req.body;
	const matchPassword = await User.compararContrasenia( password, user.password );

	if ( matchPassword ) {
		req.user = user;
		next();
	} else {
		res.status( 200 ).json( { error: 'Contraseña Incorrecta, Ese usuario ya Existe' } );
	}
};

/** Metodo POST para guardar URLs
 * @type {function}
 * @param {Object} req - "request" de la ruta
 * @param {function} next - continuar con el siguiente middleware
 * @param {Object} res - "response" de la ruta
 * @param {function} res.status - función para enviar un estado http con json
*/

export const userRegister = async ( req, res, next ) => {
	if ( !req.register ) next();
	const {
		nick,
		password
	} = req.body;

	const findUser = await User.findOne( { nick } );

	if ( findUser ) {
		dataUser( req, res, next, findUser );
	} else {
		const newUser = new User( {
			nick,
			password: await User.encriptarContrasenia( password ),
		} );

		const userSave = await newUser.save();

		res.status( 200 ).json( userSave );
	}
};

/** Metodo POST para guardar URLs
 * @type {function}
 * @param {Object} req - "request" de la ruta
 * @param {function} next - continuar con el siguiente middleware
 * @param {Object} res - "response" de la ruta
 * @param {function} res.status - función para enviar un estado http con json
*/

export const dataEmpy = async ( req, res, next ) => {
	let empy = true;
	req.register = false;
	req.urlSend = true;

	const {
		nick,
		password,
		destinationUrl,
	} = req.body;

	if ( nick !== '' || password !== '' ) {
		req.register = true;
	}

	if ( destinationUrl === '' ) {
		req.urlSend = false;
	}

	if ( !req.register && !req.urlSend ) empy = false;
	if ( !empy ) return res.status( 200 ).json( { error: 'Campos Vacios' } );
	if ( ( nick === '' || password === '' ) && req.register ) {
		return res.status( 200 ).json( { error: 'Usuario y Contraseña Necesarios' } );
	}

	next();
};
