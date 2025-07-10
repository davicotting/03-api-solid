import * as zod from "zod";
import { FastifyReply, FastifyRequest } from "fastify";
import { makeFetchCheckinsHistoryUseCase } from "@/use-cases/factories/make-fetch-user-check-ins-history-use-case";
import { makeGetUserMetricsUseCase } from "@/use-cases/factories/make-get-user-metrics-use-case";

export async function metrics(request: FastifyRequest, reply: FastifyReply) {
  const checkinUseCase = makeGetUserMetricsUseCase();
    
  const { checkinsCount } = await checkinUseCase.execute({
    userId: request.user.sub
  });

  return reply.code(200).send({
    checkinsCount,
  });
}
