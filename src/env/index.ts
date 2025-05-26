import 'dotenv/config'
import * as zod from 'zod';

const envSchema = zod.object({
    NODE_ENV: zod.enum(['dev', 'test', 'production']).default('dev'),
    PORT: zod.coerce.number().default(2323)
})

const _env = envSchema.safeParse(process.env);

if(!_env.success){
    console.error('Erro nas variaveis ambiente', _env.error.format());

    throw new Error('Erro nas variaveis ambiente');
}

export const env = _env.data;
