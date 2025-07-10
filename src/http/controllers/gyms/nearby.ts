import * as zod from "zod";
import { FastifyReply, FastifyRequest } from "fastify";
import { makeNearbyGymsUseCase } from "@/use-cases/factories/make-fetch-nearby-gym-use-case";

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
  const nearbyGymsUseCase = makeNearbyGymsUseCase();

  const schema = zod.object({
    latitude: zod.coerce.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    longitude: zod.coerce.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
  });

  const { latitude, longitude } = schema.parse(
    request.query
  );

  const { gyms } = await nearbyGymsUseCase.execute({
    userLatitude: latitude,
    userLongitude: longitude,
  });

  return reply.code(200).send({
    gyms,
  });
}
