import dotenv from "dotenv";
dotenv.config();

const config = {
  server: {
    port: getEnvVar("PORT"),
  },
  db: {
    url: getEnvVar("MONGO_URL"),
  },
  jwt: {
    secret: getEnvVar("JWT_SECRET_KEY"),
  },
};

function getEnvVar(name) {
  if (!process.env[name]) {
    throw new Error(`cannot find process.env.${name}`);
  }
  return process.env[name];
}

export default config;
