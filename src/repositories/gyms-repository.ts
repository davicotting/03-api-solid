import { Gym, Prisma } from "generated/prisma";

export interface FindManyNearbyParams{
    latitude: number;
    longitude: number;
}

export interface GymsRepository{
    findById(id: string): Promise<Gym | null>
    create(data: Prisma.GymCreateInput): Promise<Gym>
    findMany(query: string, page: number): Promise<Gym[]>
    findManyNearby(data: FindManyNearbyParams): Promise<Gym[]>
}