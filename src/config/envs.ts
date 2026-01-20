import 'dotenv/config';
import * as joi from 'joi';

interface EnvVariables {
  PORT: number;
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
}

const envvariablesRequeridas= joi.object({
  PORT: joi.number().required(),
})
.unknown(true);

const {error, value} = envvariablesRequeridas.validate(process.env);
if (error) {
  throw new Error(`error en la configuración: ${error.message}`);
}

const enVars: EnvVariables = value;

export const envs = {  
    port: enVars.PORT,
    db_host: enVars.DB_HOST,
    db_port: enVars.DB_PORT,
    db_user: enVars.DB_USER,
    db_password: enVars.DB_PASSWORD,
    db_name: enVars.DB_NAME,
};    