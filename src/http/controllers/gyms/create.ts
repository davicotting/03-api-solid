import { makeCreateGymUseCase } from "@/use-cases/factories/make-create-gym-use-case";
import * as zod from "zod";
import { FastifyReply, FastifyRequest } from "fastify";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createGymUseCase = makeCreateGymUseCase();

  const schema = zod.object({
    title: zod.string(),
    name: zod.string(),
    description: zod.string().nullable(),
    phone: zod.string().nullable(),
    latitude: zod.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    longitude: zod.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
  });

  const { title, name, description, phone, latitude, longitude } = schema.parse(
    request.body
  );

  const { gym } = await createGymUseCase.execute({
    title,
    name,
    description,
    latitude,
    longitude,
    phone,
  });

  return reply.code(201).send({
    gym,
  });
}
