// @ts-nocheck
import qrcode from 'qrcode';

import * as encrypt from '../libs/bcrypt';

import {
	getShortUrl,
	getHost,
	getCode,
	renderHome
} from '../libs/redirect';

import { errorMsg } from '../libs/error';

export const RegisterUrl = class {
	constructor( req, res ) {
		this.req = req;
		this.res = res;
	}

	// eslint-disable-next-line class-methods-use-this
	data() {}

	// eslint-disable-next-line class-methods-use-this
	async workflowShortUrl( Model, shortUrl ) {
		shortUrl = await getShortUrl( shortUrl );
		const getUrl = await Model.findOne( { path: shortUrl } );
		if ( getUrl ) {
			return false;
		}
		return shortUrl;
	}

	static async saveUrlInDb( Model, data ) {
		const newUrl = new Model( {
			...data
		} );
		return newUrl;
	}

	async workflowUrl( Model, type ) {
		const {
			destinationUrl,
			passwordUrl
		} = this.req.body;

		let { shortUrl, views } = this.req.body;
		let password;

		if ( shortUrl === '' ) {
			shortUrl = await getCode( type );
		} else {
			if ( type === 'tmp' ) shortUrl += '-tmp';
			shortUrl = await this.workflowShortUrl( Model, shortUrl );
			if ( !shortUrl ) {
				return errorMsg( {
					req: this.req,
					res: this.res,
					error: 'El Short Url Ingresado ya Existe'
				} );
			}
		}

		if ( views !== '' ) {
			try {
				views = parseInt( views, 10 );
				if ( views < 0 ) views = '';
				views = views.toString();
			} catch ( e ) {
				views = '';
			}
		}

		if ( passwordUrl === '' ) {
			password = '';
		} else {
			password = await encrypt.encriptPass( passwordUrl );
		}

		const host = await getHost( this.req, this.res );
		let qrUrl = host;
		qrUrl += shortUrl;

		const qr = await qrcode.toDataURL( qrUrl );

		const data = this.data( {
			qr,
			shortUrl,
			destinationUrl,
			views,
			password
		} );

		const saveUrl = await RegisterUrl.saveUrlInDb( Model, data );
		if ( type === 'user' ) saveUrl.user = this.req.user.nick;
		await saveUrl.save();

		renderHome( {
			req: this.req,
			res: this.res,
			saveUrl
		} );
	}
};
