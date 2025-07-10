import * as zod from "zod";
import { FastifyReply, FastifyRequest } from "fastify";
import { makeCheckinUseCase } from "@/use-cases/factories/make-checkin-use-case";
import { makeValidateCheckinUseCase } from "@/use-cases/factories/make-validate-chekins-use-case";

export async function validate(request: FastifyRequest, reply: FastifyReply) {
  const checkinUseCase = makeValidateCheckinUseCase();

  const requestParamsSchema = zod.object({
    checkInId: zod.string().uuid(),
  });

  const { checkInId } = requestParamsSchema.parse(request.params);

  const { checkIn } = await checkinUseCase.execute({
    id: checkInId
  });

  return reply.code(204).send({
    checkIn,
  });
}
