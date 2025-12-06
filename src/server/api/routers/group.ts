import type { group, member } from "@prisma/client";
import { TRPCClientError } from "@trpc/client";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { shuffle1 } from "./util";
import { env } from "~/env";
import { type TypeSendEmail, emailSend } from "~/server/email";
import PostHogClient from "~/utils/posthog";

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
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="margin: 0; padding: 0; font-family: 'Georgia', 'Times New Roman', serif; background: linear-gradient(135deg, #1a472a 0%, #2d5a3d 50%, #1a472a 100%);">
    <div style="max-width: 600px; margin: 0 auto; background-color: #1a472a; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.3);">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #c41e3a 0%, #165b33 100%); padding: 40px 20px; text-align: center; position: relative;">
        <div style="font-size: 48px; margin-bottom: 10px;">🎄🎅🎄</div>
        <h1 style="color: #ffffff; margin: 0; font-size: 32px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); letter-spacing: 2px;">Secret Santa Reveal!</h1>
        <p style="color: #ffd700; margin: 10px 0 0 0; font-size: 18px; font-weight: bold;">${args.group.name}</p>
      </div>
      
      <!-- Content -->
      <div style="padding: 40px 30px; background: #ffffff;">
        <div style="background: linear-gradient(to right, #fff5f5, #f0fff4); border-left: 4px solid #c41e3a; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
          <p style="color: #2d5a3d; font-size: 18px; line-height: 1.8; margin: 0;">
            🎅 <strong style="color: #c41e3a; font-size: 20px;">Hallo Santa ${args.santa_name}!</strong><br/><br/>
            
            Your friends have chosen you to be part of the <strong style="color: #165b33;">${args.group.name}</strong> Secret Santa this year! 🎁<br/><br/>
            
            The automatic matching has been completed, and you've been secretly paired with one of your friends! 🎄<br/><br/>
            
            <span style="font-size: 16px; color: #c41e3a;">✨ Click the button below to discover who you'll be gifting this Christmas! ✨</span>
          </p>
        </div>
        
        <!-- Button -->
        <div style="text-align: center; margin: 35px 0;">
          <a href="${args.receiver_reveal_link}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #c41e3a 0%, #a01729 100%); color: #1a472a; text-decoration: none; padding: 18px 45px; border-radius: 50px; font-size: 18px; font-weight: bold; box-shadow: 0 6px 20px rgba(196, 30, 58, 0.4); transition: all 0.3s ease; border: 3px solid #ffd700;">
            🎁 Reveal Your Match! 🎁
          </a>
        </div>
        
        <div style="text-align: center; margin-top: 20px;">
          <p style="color: #666; font-size: 12px; margin: 5px 0;">Or copy this link:</p>
          <p style="color: #165b33; font-size: 12px; word-break: break-all; margin: 5px 0;">${args.receiver_reveal_link}</p>
        </div>
      </div>
            
      <!-- Footer -->
      <div style="background: linear-gradient(135deg, #165b33 0%, #1a472a 100%); padding: 25px; text-align: center;">
        <p style="color: #ffd700; margin: 0; font-size: 14px;">🎄 Merry Christmas & Blessed Gifting! 🎄</p>
        <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 12px; opacity: 0.9;">May your heart be filled with joy and peace!</p>
      </div>
    </div>
  </body>
  </html>
`;
}

export function returnFormatEmailHintToSanta(args: {
  santa: member;
  base_url: string;
  group: group;
}): string {
  const hints_link = `${args.base_url}/room_of_requirements?id=${args.santa.id}`;
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="margin: 0; padding: 0; font-family: 'Georgia', 'Times New Roman', serif; background: linear-gradient(135deg, #1a472a 0%, #2d5a3d 50%, #1a472a 100%);">
    <div style="max-width: 600px; margin: 0 auto; background-color: #1a472a; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.3);">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #165b33 0%, #0f3d22 100%); padding: 40px 20px; text-align: center; position: relative;">
        <div style="font-size: 48px; margin-bottom: 10px;">🎄🎅🎄</div>
        <h1 style="color: #ffffff; margin: 0; font-size: 32px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); letter-spacing: 2px;">Secret Santa</h1>
        <p style="color: #ffd700; margin: 10px 0 0 0; font-size: 18px; font-weight: bold;">${args.group.name} - Gift Hints Received</p>
      </div>
      
      <!-- Content -->
      <div style="padding: 40px 30px; background: #ffffff;">
        <div style="background: linear-gradient(to right, #f0fff4, #fff5f5); border-left: 4px solid #165b33; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
          <p style="color: #2d5a3d; font-size: 18px; line-height: 1.8; margin: 0;">
            🎅 <strong style="color: #165b33; font-size: 20px;">Great News, ${args.santa.name}!</strong><br/><br/>
            
            Your gift receiver has sent you some special hints about what they'd love for Christmas! 🎁✨<br/><br/>
            
            These clues should help guide you in choosing the perfect gift that will bring joy to their Christmas season! 🎄<br/><br/>
            
            <span style="font-size: 16px; color: #c41e3a;">💡 Click below to discover their wishlist hints! 💡</span>
          </p>
        </div>
        
        <!-- Button -->
        <div style="text-align: center; margin: 35px 0;">
          <a href="${hints_link}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #165b33 0%, #0f3d22 100%); color: #1a472a; text-decoration: none; padding: 18px 45px; border-radius: 50px; font-size: 18px; font-weight: bold; box-shadow: 0 6px 20px rgba(22, 91, 51, 0.4); transition: all 0.3s ease; border: 3px solid #ffd700;">
            🎁 View Gift Hints! 🎁
          </a>
        </div>
        
        <div style="text-align: center; margin-top: 20px;">
          <p style="color: #666; font-size: 12px; margin: 5px 0;">Or copy this link:</p>
          <p style="color: #165b33; font-size: 12px; word-break: break-all; margin: 5px 0;">${hints_link}</p>
        </div>
      </div>
            
      <!-- Footer -->
      <div style="background: linear-gradient(135deg, #165b33 0%, #1a472a 100%); padding: 25px; text-align: center;">
        <p style="color: #ffd700; margin: 0; font-size: 14px;">🎄 Blessed Gift Hunting! 🎄</p>
        <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 12px; opacity: 0.9;">May you find the perfect gift to spread love and joy this Christmas!</p>
      </div>
    </div>
  </body>
  </html>
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
    .input(z.object({ email: z.string().email() }))
    .input(z.object({ group_name: z.string() }))
    .mutation(async ({ ctx, input }): Promise<TypeRes & { group?: group }> => {
      const group = await ctx.db.group.create({
        data: {
          name: input.group_name,
          email: input.email,
          password: String(Math.floor(Math.random() * 5001)),
          is_matched: false,
        },
      });
      if (!group) {
        return {
          isError: true,
          message: `Failed to create group`,
        };
      } else {
        await ctx.db.member.create({
          data: {
            name: input.name,
            email: input.email,
            group_id: group.id,
          },
        });
        const link = `${
          env.BASE_URL ?? "https://santa.maravian.com"
        }/group/link?id=${group.id}&pwd=${group.password}`;
        await emailSend({
          to: input.email,
          subject: `Secret Santa - ${group.name} - Admin Link`,
          text: `You have created a Secret Santa group for ${group.name}. Please keep this admin link private and use it to manage your group.`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Georgia', 'Times New Roman', serif; background: linear-gradient(135deg, #1a472a 0%, #2d5a3d 50%, #1a472a 100%);">
              <div style="max-width: 600px; margin: 0 auto; background-color: #1a472a; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.3);">
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%); padding: 40px 20px; text-align: center; position: relative;">
                  <div style="font-size: 48px; margin-bottom: 10px;">🎄🎅🎄</div>
                  <h1 style="color: #ffffff; margin: 0; font-size: 32px; text-shadow: 2px 2px 4px rgba(255,255,255,0.5); letter-spacing: 2px;">Secret Santa</h1>
                  <p style="color: #ffd700; margin: 10px 0 0 0; font-size: 18px; font-weight: bold;">Group Created: ${group.name}</p>
                </div>
                
                <!-- Content -->
                <div style="padding: 40px 30px; background: #ffffff;">
                  <div style="background: linear-gradient(to right, #fffbea, #fff5f5); border-left: 4px solid #ffd700; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                    <p style="color: #2d5a3d; font-size: 18px; line-height: 1.8; margin: 0;">
                      <strong style="color: #c41e3a; font-size: 20px;">Congratulations, ${input.name}!</strong><br/><br/>
                      
                      You have successfully created the <strong style="color: #165b33;">${group.name}</strong> Secret Santa group! 🎅🎄<br/><br/>
                      
                      As the <strong style="color: #ffd700; background: #1a472a; padding: 2px 8px; border-radius: 4px;">Link Maker</strong>, you have special admin powers! 🔑<br/><br/>
                      
                      <span style="font-size: 16px; color: #c41e3a; font-weight: bold;">⚠️ IMPORTANT: Keep this link private and secure! ⚠️</span><br/><br/>
                      
                      <span style="font-size: 15px; color: #2d5a3d;">Use this admin link to:</span><br/>
                      • Add or remove participants 👥<br/>
                      • Match Secret Santas 🎁<br/>
                      • Resend emails to participants 📧<br/>
                      • Manage your group settings ⚙️
                    </p>
                  </div>
                  
                  <!-- Button -->
                  <div style="text-align: center; margin: 35px 0;">
                    <a href="${link}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%); color: #1a472a; text-decoration: none; padding: 18px 45px; border-radius: 50px; font-size: 18px; font-weight: bold; box-shadow: 0 6px 20px rgba(255, 215, 0, 0.4); transition: all 0.3s ease; border: 3px solid #c41e3a;">
                      Access Admin Panel 
                    </a>
                  </div>
                  
                  <div style="text-align: center; margin-top: 20px; padding: 15px; background: #fff5f5; border-radius: 8px; border: 2px dashed #c41e3a;">
                    <p style="color: #c41e3a; font-size: 13px; margin: 5px 0; font-weight: bold;">🔒 Keep this admin link secure!</p>
                    <p style="color: #666; font-size: 11px; word-break: break-all; margin: 5px 0;">${link}</p>
                  </div>
                </div>
                
                <!-- Footer -->
                <div style="background: linear-gradient(135deg, #165b33 0%, #1a472a 100%); padding: 25px; text-align: center;">
                  <p style="color: #ffffff; margin: 0; font-size: 14px;">🎄 Let the Secret Santa Begin! 🎄</p>
                  <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 12px; opacity: 0.9;">Spread joy and holiday cheer with your friends!</p>
                </div>
              </div>
            </body>
            </html>
          `,
        });

        // Track group creation
        const posthog = PostHogClient();
        posthog.capture({
          distinctId: group.id,
          event: "group_created",
          properties: {
            group_id: group.id,
            group_name: group.name,
            creator_email: input.email,
            creator_name: input.name,
          },
        });
        await posthog.shutdown();
        return {
          isError: false,
          message: `Successfully created your Secret Santa ${group.name} Group`,
          group,
        };
      }
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
      if (group?.password === input.pwd) {
        isAuth = true;

        // Track admin link access
        const posthog = PostHogClient();
        posthog.capture({
          distinctId: group.id,
          event: "admin_link_accessed",
          properties: {
            group_id: group.id,
            group_name: group.name,
          },
        });
        await posthog.shutdown();
      }

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
    .mutation(async ({ ctx, input }) => {
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
        const member = await ctx.db.member.create({
          data: {
            name: input.name,
            email: input.email,
            group_id: input.group_id,
          },
        });

        // Track member addition
        const posthog = PostHogClient();
        posthog.capture({
          distinctId: input.group_id,
          event: "member_added",
          properties: {
            group_id: input.group_id,
            member_name: input.name,
            member_email: input.email,
          },
        });
        await posthog.shutdown();

        return member;
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

          // Track santas matched
          const posthog = PostHogClient();
          posthog.capture({
            distinctId: input.group_id,
            event: "santas_matched",
            properties: {
              group_id: input.group_id,
              group_name: group.name,
              member_count: assignedMembers.length,
              is_rematch: input.is_rematch ?? false,
            },
          });
          await posthog.shutdown();
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
          // subject: `Secret Santa - ${santa.group.name} - Hints`,
          subject: `Santa ${santa.name}, your Receiver sent you hints`,
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

        // Track hints sent to santa
        const posthog = PostHogClient();
        posthog.capture({
          distinctId: santa.group_id,
          event: "hints_sent_to_santa",
          properties: {
            group_id: santa.group_id,
            group_name: santa.group.name,
            receiver_id: receiver.id,
            santa_id: santa.id,
            hint_count: hints.length,
          },
        });
        await posthog.shutdown();

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

        // Track receiver revealed
        const posthog = PostHogClient();
        posthog.capture({
          distinctId: santa.group_id,
          event: "receiver_revealed",
          properties: {
            group_id: santa.group_id,
            santa_id: santa.id,
            receiver_id: receiver.id,
          },
        });
        await posthog.shutdown();

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

      // Track bulk emails sent
      const posthog = PostHogClient();
      posthog.capture({
        distinctId: input.id,
        event: "bulk_emails_sent",
        properties: {
          group_id: input.id,
          group_name: group.name,
          action: input.action,
          member_count: group.members.length,
          failed_count: failedMembers.length,
        },
      });
      await posthog.shutdown();

      return {
        isError: false,
        message: `Successfully sent emails to all members`,
      };
    }),
});
