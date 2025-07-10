import * as zod from "zod";
import { FastifyReply, FastifyRequest } from "fastify";
import { makeCheckinUseCase } from "@/use-cases/factories/make-checkin-use-case";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const checkinUseCase = makeCheckinUseCase();

  const requestParamsSchema = zod.object({
    gymId: zod.string().uuid(),
  });

  const requestBodyschema = zod.object({
    latitude: zod.coerce.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    longitude: zod.coerce.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
  });

  const { latitude, longitude } = requestBodyschema.parse(request.body);
  const { gymId } = requestParamsSchema.parse(request.params);

  const { checkIn } = await checkinUseCase.execute({
    userLatitude: latitude,
    userLongitude: longitude,
    gym_id: gymId,
    userId: request.user.sub,
  });

  return reply.code(201).send({
    checkIn,
  });
}
