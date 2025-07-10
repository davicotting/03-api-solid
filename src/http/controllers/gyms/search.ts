import * as zod from "zod";
import { FastifyReply, FastifyRequest } from "fastify";
import { makeSearchGymsUseCase } from "@/use-cases/factories/make-search-gyms-use-case";

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const createGymUseCase = makeSearchGymsUseCase();

  const schema = zod.object({
    query: zod.string(),
    page: zod.coerce.number().min(1).default(1)
  });

  const { page, query } = schema.parse(
    request.query
  );

  const { gyms } = await createGymUseCase.execute({
    page,
    query
  });

  return reply.code(200).send({
    gyms,
  });
}
