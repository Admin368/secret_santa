import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const groupRouter = createTRPCRouter({
  test: publicProcedure.query(() => {
    return {
      greeting: `Hello`,
    };
  }),
  create: publicProcedure.mutation(async ({ ctx }) => {
    return ctx.db.group.create({
      data: {
        password: String(Math.floor(Math.random() * 5001)),
        is_matched: false,
      },
    });
  }),
  get: publicProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(({ ctx, input }) => {
      return ctx.db.group.findUnique({
        where: {
          id: input.id,
        },
      });
    }),
});
