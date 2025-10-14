// src/config.ts

function getEnvVar(key: string, required = true): string {
	const value = process.env[key];
	if (!value && required) {
		throw new Error(`🚨 Missing required environment variable: ${key}`);
	}
	return value!;
}

export const config = {
	// Base
	stage: process.env.STAGE || "DEVELOP",
	port: Number(process.env.PORT) || 3000,

	// Database
	db: {
		host: getEnvVar("HOST"),
		port: Number(process.env.PORT_DB) || 5432,
		username: getEnvVar("USERNAME_DB"),
		password: getEnvVar("PASSWORD"),
		database: getEnvVar("DATABASE"),
		ssl: process.env.DB_SSL === "true",
	},

	// Email
	email: {
		user: getEnvVar("GMAIL_USER"),
		appPassword: getEnvVar("GMAIL_APP_PASSWORD"),
		templatePath: getEnvVar("TEMPLATE_EMAIL_PATH"),
		domain: getEnvVar("DOMAIN"),
	},

	// Auth tokens
	tokens: {
		duration: Number(getEnvVar("TOKENDURATION")),
		refreshDuration: Number(getEnvVar("REFRESHTOKENDURATION")),
		resetPasswordDuration: Number(getEnvVar("TOKENRESETPASSWORDDURATION")),
		invitationDuration: Number(getEnvVar("TOKENINVITATIONDURATION")),
	},

	// WebSocket
	websocketPort: Number(process.env.WEBSOCKET_PORT) || 3001,

	// imagekit
	googleCloud: {
		publicKey: getEnvVar("IMAGEKIT_PUBLIC_KEY"),
		privateKey: getEnvVar("IMAGEKIT_PRIVATE_KEY"),
		url: getEnvVar("IMAGEKIT_URL_ENDPOINT"),
	},
};
