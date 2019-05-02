import dotenv from 'dotenv';
dotenv.config();

const env = {
  PORT: process.env.PORT as string,
  LND_GRPC_URL: process.env.LND_GRPC_URL as string,
  LND_ADMIN_MACAROON: process.env.LND_ADMIN_MACAROON as string,
  LND_TLS_CERT: process.env.LND_TLS_CERT as string,
};

// Ensure all keys exist
Object.entries(env).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`Required environment variable '${key}' is missing!`);
  }
});

export default env;