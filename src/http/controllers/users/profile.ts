import { makeGetUserProfileUseCase } from "@/use-cases/factories/make-get-user-profile-use-case";
import { FastifyReply, FastifyRequest } from "fastify";

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  const getUserProfile = makeGetUserProfileUseCase();

  const user_id = request.user.sub;

  console.log(user_id);

  const { user } = await getUserProfile.execute({
    id: user_id,
  });

  return reply.code(200).send({
    user: {
      ...user,
      password_hash: undefined,
    },
  });
}
