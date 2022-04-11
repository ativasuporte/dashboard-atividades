'use strict';
import express, { Request, Response } from 'express';

export = () => {
	const http = require('http');
	const config = require('./config/server.config');
	const middleware = require('./lib/middleware.lib');

	// Configurações do express / http
	const app = express();
	const server = http.createServer(app);

	const authController = require('./controllers/auth.controller');

	config.dbConfig();
	config.hbsConfig(app);
	config.sessionConfig(app);
	config.authConfig(app);
	config.flashConfig(app);

	app.use(express.json({ limit: '50mb' }));
	app.use(express.urlencoded({ extended: true }));

	app.use(middleware.timeLog);
	app.use('/auth', authController);

	app.get('/', middleware.checkSession, (req, res) => {
		res.render('index', {
			title: 'Dashboard',
			name: req.session.name,
			username: req.session.username,
		});
	});

	app.get('/logout', (req, res) => {
		req.session.destroy();
		res.redirect('/');
	});

	// app.get('/login', (req, res) => {
	// 	res.render('pages/login', { title: 'Login' });
	// });

	app.use('/public', config.publicConfig(express));

	server.listen(config.port, () => {
		console.log(`[SERVER] Servidor ouvindo na porta ${config.port}`);
	});
};
