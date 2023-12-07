import type { member } from "@prisma/client";
import { TRPCClientError } from "@trpc/client";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { shuffle1 } from "./util";
import { env } from "~/env";

// const BASE_URL = "https://192.168.1.102:3000";

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
    .input(z.object({ pwd: z.string().min(1) }))
    .query(({ ctx, input }) => {
      return ctx.db.group.findUnique({
        where: {
          id: input.id,
          password: input.pwd,
        },
        include: {
          members: true,
        },
      });
    }),
  auth: publicProcedure
    .input(
      z.object({
        id: z.string().min(1),
        pwd: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      let isAuth = false;
      const group = await ctx.db.group.findUnique({
        where: {
          id: input.id,
        },
      });
      if (group?.password === input.pwd) isAuth = true;
      return {
        isAuth,
      };
    }),
  member_add: publicProcedure
    .input(z.object({ group_id: z.string().min(1) }))
    .input(z.object({ name: z.string().min(1) }))
    .input(z.object({ email: z.string().email() }))
    .input(z.object({ is_edit: z.boolean().optional() }))
    .input(z.object({ id: z.string().min(1).optional() }))
    .mutation(({ ctx, input }) => {
      if (input.is_edit === true && input.id) {
        return ctx.db.member.update({
          where: {
            id: input.id,
            group_id: input.group_id,
          },
          data: {
            name: input.name,
            email: input.email,
          },
        });
      } else {
        return ctx.db.member.create({
          data: {
            name: input.name,
            email: input.email,
            group_id: input.group_id,
          },
        });
      }
    }),
  member_remove: publicProcedure
    .input(z.object({ group_id: z.string().min(1) }))
    .input(z.object({ pwd: z.string().min(1) }))
    .input(z.object({ member_id: z.string().min(1) }))
    .mutation(({ ctx, input }) => {
      return ctx.db.member.delete({
        where: {
          id: input.member_id,
          group: {
            id: input.group_id,
            password: input.pwd,
          },
        },
      });
    }),
  members_make_santas: publicProcedure
    .input(z.object({ group_id: z.string().min(1) }))
    .input(z.object({ pwd: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const group = await ctx.db.group.findUnique({
        where: {
          id: input.group_id,
        },
        include: {
          members: true,
        },
      });
      const members = group?.members;
      if (group && members) {
        console.log(`MAKING SANTA'S FOR ${group.id}`);
        function secretSanta(users: member[]) {
          const shuffledUsers = shuffle1(users) as unknown as member[];
          const assignments = [];

          for (let i = 0; i < shuffledUsers.length; i++) {
            const currentUser = shuffledUsers[i];
            const nextUser = shuffledUsers[(i + 1) % shuffledUsers.length];
            if (currentUser && nextUser) {
              assignments.push({
                giver: currentUser,
                receiver: nextUser,
              });
            }
          }

          return assignments;
        }
        const assignedMembers: member[] = [];
        const assignments = secretSanta(members);
        await Promise.all(
          assignments.map(async ({ giver, receiver }) => {
            const assignedMember = await ctx.db.member.update({
              where: {
                id: giver.id,
              },
              data: {
                receiver_id: receiver.id,
                link: `${env.NEXTAUTH_URL}/grinch?id=${giver.id}`,
                link_is_seen: false,
              },
            });
            if (assignedMember) {
              assignedMembers.push(assignedMember);
            }
          }),
        );

        // update is matched
        await ctx.db.group.update({
          where: {
            id: input.group_id,
          },
          data: {
            is_matched: true,
          },
        });
        // return assignedMembers;
        return true;
      } else {
        throw new TRPCClientError("Group or members not found");
      }
    }),
  member_get: publicProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(({ ctx, input }) => {
      return ctx.db.member.findUnique({
        where: {
          id: input.id,
        },
      });
    }),
  member_hints_update: publicProcedure
    .input(z.object({ id: z.string().min(1) }))
    .input(z.object({ hints: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.member.update({
        where: {
          id: input.id,
        },
        data: {
          hints: input.hints,
        },
      });
    }),
});
