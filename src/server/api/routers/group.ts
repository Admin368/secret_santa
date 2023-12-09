import type { group, member } from "@prisma/client";
import { TRPCClientError } from "@trpc/client";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { shuffle1 } from "./util";
import { env } from "~/env";
import { type TypeSendEmail, emailSend } from "~/server/email";

const BASE_URL = env.BASE_URL;

interface TypeRes {
  isError: boolean;
  message: string;
}

export function returnFormatEmailRevealReceiver(args: {
  santa_name: string;
  receiver_reveal_link: string;
  base_url: string;
}): string {
  return `
  <div width="100%">
    <h1>Secret Santa Reveal</h1>
    <p>Greetings Santa ${args.santa_name},</p>
    <p>Your friends have submitted you to be part of the secret santa for this year,</p>
    <p>You have been secretely matched to gift one of your friends,</p>
    <p>Click the link below to find out whose secret santa you will be!</p>
    <a href="${args.receiver_reveal_link}" target="_blank">${args.receiver_reveal_link}</a>
    <iframe src="${args.base_url}/revelio/prelink?link=${args.receiver_reveal_link}" height="600px" width="600px"></iframe>
  </div>
`;
}
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
    .input(z.object({ is_rematch: z.boolean().optional() }))
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
        if (input.is_rematch && group.is_matched) {
          await Promise.all(
            assignments.map(async ({ giver }) => {
              await ctx.db.member.update({
                where: {
                  id: giver.id,
                },
                data: {
                  receiver_id: null,
                  link: null,
                  link_is_seen: false,
                },
              });
            }),
          );
        }
        await Promise.all(
          assignments.map(async ({ giver, receiver }) => {
            const assignedMember = await ctx.db.member.update({
              where: {
                id: giver.id,
              },
              data: {
                receiver_id: receiver.id,
                link: `${BASE_URL}/revelio?id=${giver.id}`,
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
    .mutation(async ({ ctx, input }): Promise<TypeRes> => {
      try {
        await ctx.db.member.update({
          where: {
            id: input.id,
          },
          data: {
            hints: input.hints,
          },
        });
        return {
          isError: false,
          message: "Successfully updated your hints",
        };
      } catch {
        return {
          isError: false,
          message: "Failed to update your hints",
        };
      }
    }),
  member_hints_send: publicProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(
      async ({ ctx, input }): Promise<TypeRes & { message: string }> => {
        const receiver = await ctx.db.member.findUnique({
          where: {
            id: input.id,
          },
        });
        if (!receiver) {
          return {
            isError: true,
            message: "Your are not assigned to any group",
          };
        }
        const santa = await ctx.db.member.findUnique({
          where: {
            receiver_id: receiver.id,
          },
        });
        if (!santa) {
          return {
            isError: true,
            message:
              "You are not matched yet with a santa contact your link maker",
          };
        }
        if (!receiver.hints) {
          return { isError: false, message: "You dont have hints" };
        }
        const hints = JSON.parse(receiver.hints) as unknown as string[];
        if (!Array.isArray(hints)) {
          return {
            isError: true,
            message: "Invalid hints format",
          };
        }
        return {
          isError: false,
          message: "A message has been sent to your Secret Santa",
        };
      },
    ),
  member_get_my_receiver: publicProcedure
    .input(
      z.object({
        id: z.string(),
        hintsOnly: z.boolean().optional(),
      }),
    )
    .mutation(
      async ({
        ctx,
        input,
      }): Promise<
        TypeRes & {
          santa_name?: string;
          receiver_name?: string;
          members?: string[];
          hints?: string[];
        }
      > => {
        const santa = await ctx.db.member.findUnique({
          where: {
            id: input.id,
            // receiver_id: input.id,
          },
          include: {
            group: {
              include: {
                members: true,
              },
            },
          },
        });
        if (!santa) return { message: "Could not find you", isError: true };

        if (!santa.receiver_id) {
          return {
            isError: true,
            message: "You have not been matched yet, please contant link maker",
          };
        }
        const receiver = await ctx.db.member.findUnique({
          where: {
            id: santa.receiver_id,
          },
        });
        if (!receiver) {
          return {
            isError: true,
            message:
              "We could not find your receiver please contact link maker to match again",
          };
        }
        const hints: string[] = [];
        if (receiver.hints) {
          const _hints: string[] = JSON.parse(receiver.hints) as string[];
          if (Array.isArray(_hints)) {
            _hints.map((hint) => {
              hints.push(hint);
            });
          }
        }
        if (input.hintsOnly) {
          return {
            isError: false,
            message: "Successfully got your hint",
            santa_name: santa.name,
            hints,
          };
        }
        if (santa.link_is_seen) {
          return {
            message: "We already told you who the santa is",
            isError: true,
          };
        }
        const members: string[] = [];
        santa.group.members.map((member) => {
          members.push(member.name);
        });
        return {
          isError: false,
          message: "We found who you are matched with",
          receiver_name: receiver.name,
          members,
        };
      },
    ),
  member_link_seen: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(
      async ({
        ctx,
        input,
      }): Promise<
        TypeRes & {
          receiver_name?: string;
        }
      > => {
        const member = await ctx.db.member.update({
          where: {
            id: input.id,
          },
          data: {
            link_is_seen: true,
          },
        });
        if (!member) {
          return {
            isError: true,
            message: "Failed to destroy your link",
          };
        }
        return {
          isError: false,
          message: "Your receiver info will now self destruct",
        };
      },
    ),
  email_send: publicProcedure
    .input(
      z.object({
        id: z.string(),
        type: z.union([z.literal("group"), z.literal("member")]),
        action: z.union([
          z.literal("send_santa_receiver_name"),
          z.literal("notify_hints"),
        ]),
      }),
    )
    .mutation(async ({ ctx, input }): Promise<TypeRes> => {
      let memberORgroup: member | group | null = null;
      switch (input.type) {
        case "member":
          memberORgroup = await ctx.db.member.findUnique({
            where: {
              id: input.id,
            },
          });
          break;
        case "group":
          memberORgroup = await ctx.db.member.findUnique({
            where: {
              id: input.id,
            },
          });
          break;
        default:
          return {
            isError: true,
            message: "Please provide an email action",
          };
      }

      if (!memberORgroup) {
        return {
          isError: true,
          message: "Could not find the member",
        };
      }
      // const email_res = emailSend({});
      let message: TypeSendEmail | undefined = undefined;

      switch (input.action) {
        case "send_santa_receiver_name":
          if (!memberORgroup.link) {
            return {
              isError: true,
              message:
                "You have no reveal link, please contact admin or link maker to match again",
            };
          }
          message = {
            to: memberORgroup.email,
            subject: "Secret Santa - Reveal",
            text: "You have been chosen your friend group to be somebody's Secret Santa",
            html: returnFormatEmailRevealReceiver({
              santa_name: memberORgroup.name,
              receiver_reveal_link: memberORgroup.link,
              base_url: BASE_URL,
            }),
          };
          break;
        default:
      }
      if (input.type === "member" && message) {
        const email = memberORgroup.email;
        console.log(`Sending Email to ${email}`);
        const email_res = await emailSend(message);
        if (email_res) {
          return {
            isError: false,
            message: `Successfully sent email to ${message.to}`,
          };
        } else {
          return {
            isError: true,
            message: `Failed to send email to ${message.to}`,
          };
        }
        console.log(email_res ? "email-success" : "email-failed");
      }
      return {
        isError: true,
        message: "Finished but email status not confirmed",
      };
      // return ctx.db.group.create({
      //   data: {
      //     password: String(Math.floor(Math.random() * 5001)),
      //     is_matched: false,
      //   },
      // });
    }),
});
