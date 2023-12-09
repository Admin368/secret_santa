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
  group: group;
}): string {
  return `
  <div width="100%">
    <h1>Secret Santa - ${args.group.name} - Reveal</h1>
    <p>
    Greetings Santa <strong>${args.santa_name}</strong>,<br/>
    Your friends have submitted you to be part of the ${args.group.name} secret santa for this year,<br/>
    You have been secretely matched to gift one of your friends,<br/>
    Click the link below to find out whose secret santa you will be!<br/>
    <a href="${args.receiver_reveal_link}" target="_blank">${args.receiver_reveal_link}</a>
    </p>
    <iframe src="${args.base_url}/revelio/prelink?link=${args.receiver_reveal_link}" height="600px" width="600px"></iframe>
  </div>
`;
}

export function returnFormatEmailHintToSanta(args: {
  santa: member;
  base_url: string;
  group: group;
}): string {
  const hints_link = `${args.base_url}/room_of_requirements?id=${args.santa.id}`;
  return `
  <div width="100%">
    <h1>Secret Santa - ${args.group.name} - Hint</h1>
    <p>
    Greetings Santa <strong>${args.santa.name}</strong>,<br/>
    Your receiver has sent you some hints of what they want for christmas,<br/>
    Hopefully these help you in choosing your gift for them,<br/>
    Click the link below to see the hints!<br/>
    <a href="${hints_link}" target="_blank">${hints_link}</a>
    </p>
    <iframe src="/revelio/prelink?link=${hints_link}" height="600px" width="600px"></iframe>
  </div>
`;
}
export const groupRouter = createTRPCRouter({
  test: publicProcedure.query(() => {
    return {
      greeting: `Hello`,
    };
  }),
  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.group.create({
        data: {
          name: input.name,
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
  get_name: publicProcedure
    .input(z.object({ id: z.string().min(1) }))
    .input(z.object({ is_member_id: z.boolean().optional() }))
    .query(
      async ({ ctx, input }): Promise<TypeRes & { group_name?: string }> => {
        const group = input.is_member_id
          ? await ctx.db.member
              .findUnique({
                where: {
                  id: input.id,
                },
                include: {
                  group: true,
                },
              })
              .then((res) => res?.group)
          : await ctx.db.group.findUnique({
              where: {
                id: input.id,
              },
            });
        if (!group) {
          return {
            isError: true,
            message: `Could not find the group`,
          };
        }
        return {
          isError: false,
          message: `We found ${group.name}`,
          group_name: group.name,
        };
      },
    ),
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
    .mutation(
      async ({ ctx, input }): Promise<TypeRes & { is_matched?: boolean }> => {
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
          if (assignedMembers.length < 1) {
            return {
              isError: true,
              message: "No matching was done",
            };
          }
          // update is matched
          await ctx.db.group.update({
            where: {
              id: input.group_id,
            },
            data: {
              is_matched: true,
            },
          });

          // SEND EMAILS
          const failedEmails: string[] = [];
          await Promise.all(
            assignedMembers.map(async (assignedMember) => {
              if (assignedMember.link) {
                const message: TypeSendEmail = {
                  to: assignedMember.email,
                  subject: `Secret Santa - ${group.name} - Reveal`,
                  text: "You have been chosen your friend group to be somebody's Secret Santa",
                  html: returnFormatEmailRevealReceiver({
                    santa_name: assignedMember.name,
                    receiver_reveal_link: assignedMember.link,
                    base_url: BASE_URL,
                    group,
                  }),
                };
                const email_res = await emailSend(message);
                if (!email_res) {
                  failedEmails.push(assignedMember.email);
                }
              } else {
                console.error(`Reveal Links not generated`);
                failedEmails.push(assignedMember.email);
              }
            }),
          );

          if (failedEmails.length < 1) {
            return {
              isError: false,
              is_matched: true,
              message: `Successfully matched sent emails to all Santas`,
            };
          } else {
            return {
              isError: true,
              is_matched: true,
              message: `Successfully matched but failed to send emails to ${JSON.stringify(
                failedEmails,
              )}`,
            };
          }
        } else {
          throw new TRPCClientError("Group or members not found");
        }
      },
    ),
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
          include: { group: true },
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
        const message: TypeSendEmail = {
          to: santa.email,
          subject: `Secret Santa - ${santa.group.name} - Hints`,
          text: "Your receiver sent you hints",
          html: returnFormatEmailHintToSanta({
            santa,
            base_url: BASE_URL,
            group: santa.group,
          }),
        };
        const email_res = await emailSend(message);
        if (!email_res) {
          return {
            isError: true,
            message: `Failed to send hints`,
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
        action: z.union([
          z.literal("send_santa_receiver_name"),
          z.literal("send_all_santas_receiver_name"),
        ]),
      }),
    )
    .mutation(async ({ ctx, input }): Promise<TypeRes> => {
      const member = await ctx.db.member.findUnique({
        where: {
          id: input.id,
        },
        include: {
          group: true,
        },
      });

      if (!member) {
        return {
          isError: true,
          message: "Could not find the member",
        };
      }
      let message: TypeSendEmail | undefined = undefined;

      switch (input.action) {
        case "send_santa_receiver_name":
          if (!member.link) {
            return {
              isError: true,
              message:
                "You have no reveal link, please contact admin or link maker to match again",
            };
          }
          message = {
            to: member.email,
            subject: `Secret Santa - ${member.group.name} - Reveal`,
            text: "You have been chosen your friend group to be somebody's Secret Santa",
            html: returnFormatEmailRevealReceiver({
              santa_name: member.name,
              receiver_reveal_link: member.link,
              base_url: BASE_URL,
              group: member.group,
            }),
          };
          break;
        default:
      }
      if (message) {
        const email = member.email;
        console.log(`Sending Email to ${email}`);
        const email_res = await emailSend(message);
        if (email_res) {
          if (input.action === "send_santa_receiver_name") {
            if (member.link_is_seen === true) {
              await ctx.db.member.update({
                where: {
                  id: member.id,
                },
                data: {
                  link_is_seen: false,
                },
              });
            }
          }
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
      }
      return {
        isError: true,
        message: "Finished but email status not confirmed",
      };
    }),
  email_send_all: publicProcedure
    .input(
      z.object({
        id: z.string(),
        action: z.union([
          z.literal("send_receiver_names"),
          z.literal("send_hints"),
        ]),
      }),
    )
    .mutation(async ({ ctx, input }): Promise<TypeRes> => {
      const group = await ctx.db.group.findUnique({
        where: {
          id: input.id,
        },
        include: {
          members: true,
        },
      });
      if (!group) {
        return {
          isError: true,
          message: `Could not find your group`,
        };
      }

      if (group.is_matched !== true || group.members.length < 1) {
        return {
          isError: true,
          message: `Group is either not matched or has no members`,
        };
      }

      const failedMembers: string[] = [];
      await Promise.all(
        group.members.map(async (member) => {
          switch (input.action) {
            case "send_receiver_names":
              if (!member.link) {
                failedMembers.push(member.email);
                break;
              }
              const message: TypeSendEmail = {
                to: member.email,
                subject: `Secret Santa - ${group.name} - Reveal`,
                text: "You have been chosen your friend group to be somebody's Secret Santa",
                html: returnFormatEmailRevealReceiver({
                  santa_name: member.name,
                  receiver_reveal_link: member.link,
                  base_url: BASE_URL,
                  group,
                }),
              };
              const email_res = await emailSend(message);
              if (!email_res) {
                failedMembers.push(member.email);
              }
              break;
            default:
          }
        }),
      );
      if (failedMembers.length > 1) {
        return {
          isError: true,
          message: `Failed to send emails to these memebers ${JSON.stringify(
            failedMembers,
          )}`,
        };
      }
      return {
        isError: false,
        message: `Successfully sent emails to all members`,
      };
    }),
});
