/** La Función Home, Renderiza la pagina principal de la aplicación
 * @type {function}
 * @param {Object} _req - "request" de la ruta
 * @param {Object} res - "response" de la ruta
 * @param {function} res.render - función para renderizar el html
*/

export const home = async ( _req, res ) => {
	res.render( 'home' );
};

/** La Función Password, Renderiza la solicitud para ingresar la contraseña
 * @type {function}
 * @param {Object} _req - "request" de la ruta
 * @param {Object} res - "response" de la ruta
 * @param {function} res.render - función para renderizar el html
*/

export const password = async ( _req, res ) => {
	res.render( 'password' );
};

/** La Función pageNotFound, la ruta ingresada no fue encontrada
 * @type {function}
 * @param {Object} _req - "request" de la ruta
 * @param {Object} res - "response" de la ruta
 * @param {function} res.render - función para renderizar el html
*/

export const pageNotFound = async ( _req, res ) => {
	res.render( 'notFound' );
};

/** La Función shortUrl, verifica el link redirigir a la ruta solicitada
 * @type {function}
 * @param {Object} req - "request" de la ruta
 * @param {Object} res - "response" de la ruta
 * @param {function} res.status - función para enviar un estado http con json
*/

export const shortUrl = async ( req, res ) => {
	const { code } = req.params;
	res.status( 200 ).json( { info: code } );
};
