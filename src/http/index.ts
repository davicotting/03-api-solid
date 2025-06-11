import { FastifyInstance } from "fastify";
import { register } from "./controller/register";

export async function routes(app: FastifyInstance) {
    app.post('/users', register)
}