import fastify from "fastify";
import { routes } from "./http";
import { ZodError } from "zod";
import { env } from "./env";

export const app = fastify();

app.register(routes);

app.setErrorHandler((error, _request, reply) => {
    if(error instanceof ZodError){
        return reply.code(400).send({message: 'Validation error', issue: error.format()})
    } else{
        // todo: fazer o log com ferramentas externas como um datadog...
    }

    if(env.NODE_ENV != "production"){
        console.error(error);
    }

    return reply.code(500).send({message: 'Internal server error.'})
})