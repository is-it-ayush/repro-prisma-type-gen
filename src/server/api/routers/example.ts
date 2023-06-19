import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const exampleRouter = createTRPCRouter({
  testCreate: publicProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // works fine.
      const record = await ctx.prisma.example.create({
        data: {
          name: input.name,
        },
      });

      // bug; this shouldn't be any, never.
      const keyrecord = await ctx.prisma.keys.create({
        data: {
          name: input.name,
        },
      });

      return await ctx.prisma.example.findUnique({
        where: {
          id: record.id,
        },
      });
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
