import * as zod from "zod";
import { FastifyReply, FastifyRequest } from "fastify";
import { makeFetchCheckinsHistoryUseCase } from "@/use-cases/factories/make-fetch-user-check-ins-history-use-case";

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const checkinUseCase = makeFetchCheckinsHistoryUseCase();

  const requestQuerySchema = zod.object({
    page: zod.number().min(1).default(1)
  });

  const { page } = requestQuerySchema.parse(request.query);

  const { checkIns } = await checkinUseCase.execute({
    page,
    userId: request.user.sub
  });

  return reply.code(200).send({
    checkIns,
  });
}
