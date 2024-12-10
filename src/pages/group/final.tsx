import { type member } from "@prisma/client";
import Card from "antd/lib/card";
import Form from "antd/lib/form";
import Input from "antd/lib/input";
import Modal from "antd/lib/modal";
import Spin from "antd/lib/spin";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "~/components/Button";
import CheckAuth from "~/components/CheckAuth";
import LayoutPage from "~/layouts/LayoutPage";
import { api } from "~/utils/api";

export default function final() {
  // url params
  const router = useRouter();
  const id = router.query.id as string;
  const pwd = router.query.pwd as string;

  // requests
  const group = api.group.get.useQuery(
    { id, pwd },
    {
      enabled: id ? true : false && pwd ? true : false,
      // staleTime: Infinity,
      staleTime: 0,
      keepPreviousData: false,
    },
  );
  const memberAdd = api.group.member_add.useMutation();
  const emailSend = api.group.email_send.useMutation();
  const emailSendAll = api.group.email_send_all.useMutation();

  // form
  const [formAddPerson] = Form.useForm<
    member & { is_edit?: boolean; pwd?: string }
  >();

  // states
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("Add Person");

  // functions
  const modalOpen = useCallback(
    (args: { edit_member?: member }) => {
      formAddPerson.resetFields();
      setModalTitle("Add person");
      if (args.edit_member) {
        formAddPerson.setFieldsValue(args.edit_member);
        formAddPerson.setFieldValue("is_edit", true);
        setModalTitle("Edit person");
      }
      formAddPerson.setFieldValue("group_id", id);
      formAddPerson.setFieldValue("pwd", pwd);
      setModalIsOpen(true);
    },
    [formAddPerson, id, pwd],
  );
  const modalOnSubmit = useCallback(() => {
    const values = formAddPerson.getFieldsValue();
    if (values) {
      memberAdd
        .mutateAsync(values)
        .then(async (res) => {
          toast.success(
            `Successfully ${values.is_edit ? "edited" : "added"} ${res.name}`,
          );
          setModalIsOpen(false);
          await group.refetch();
        })
        .catch((e) => {
          toast.error("failed to add");
          console.error(e);
        });
    }
  }, [formAddPerson]);

  const onMemberResendEmail = useCallback(
    (args: { member: member }) => {
      const group_id = args.member?.group_id;
      const member = args.member;
      if (group_id && pwd && member) {
        console.log("client-send email");
        toast.info("Resending Email");
        emailSend
          .mutateAsync({
            id: member.id,
            action: "send_santa_receiver_name",
          })
          .then((res) => {
            console.log(res);
            if (res.isError) {
              toast.error(res.message);
            } else {
              toast.success(res.message);
            }
          })
          .catch((e) => {
            console.error(e);
          });
      }
    },
    [id, group, pwd],
  );

  const onMembersResendAllEmails = useCallback(() => {
    const group_id = id;
    if (group_id && pwd) {
      console.log("client-send email to all");
      emailSendAll
        .mutateAsync({
          id: group_id,
          action: "send_receiver_names",
        })
        .then((res) => {
          console.log(res);
          if (res.isError) {
            toast.error(res.message);
          } else {
            toast.success(res.message);
          }
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [id, group, pwd]);

  // useEffects
  return (
    <LayoutPage pageTitle="Group - Final">
      <CheckAuth />
      <Modal
        open={modalIsOpen}
        centered
        onCancel={() => {
          setModalIsOpen(false);
        }}
        onOk={() => {
          // modalOnSubmit();
          formAddPerson.submit();
        }}
        closable={false}
      >
        <Card title={modalTitle} loading={memberAdd.isLoading}>
          <Form form={formAddPerson} onFinish={modalOnSubmit}>
            <Form.Item name="group_id" label="Group Id" hidden>
              <Input disabled />
            </Form.Item>
            <Form.Item name="pwd" label="Password" hidden>
              <Input disabled />
            </Form.Item>
            <Form.Item name="is_edit" label="isEdit" hidden>
              <Input disabled />
            </Form.Item>
            <Form.Item name="id" label="id" hidden>
              <Input disabled />
            </Form.Item>
            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="email"
              rules={[{ required: true, type: "email" }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Card>
      </Modal>
      <div className="container flex flex-col justify-start text-center text-white">
        <Spin spinning={!group.data || group.isLoading}>
          <div className="text-center text-white">
            <p className="py-2.5  text-2xl text-white">Behold your santas</p>
            <p className="py-2.5 font-light">
              The Santas have been emailed.
              <br />
              Please notify them to check their
              <br />
              emails & trash box
            </p>
          </div>
          <div
            // className="h-75 w-75 flex flex-col rounded-md border text-black"
            style={{
              //   width: "300px",
              width: "100%",
              borderRadius: 5,
              flex: 1,
              alignItems: "center",
              padding: 20,
              gap: 5,
              display: "flex",
              flexDirection: "column",
              border: `1px solid white`,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                width: "100%",
                height: "fit-content",
                maxHeight: "50vh",
                overflow: "auto",
                gap: 5,
              }}
            >
              {group.data?.members && group.data?.members?.length > 0 ? (
                group.data?.members.map((member, index) => {
                  return (
                    <Button
                      id={member.id}
                      key={index}
                      text={member.name}
                      subText={member.email}
                      isInverted
                      width="100%"
                      isSeen={member.link_is_seen === true ? true : false}
                      isEmailSent={
                        member.match_email_is_sent === true ? true : false
                      }
                      menuOptions={[
                        {
                          key: "email_send",
                          label: "Resend Email",
                          onClick: () => {
                            onMemberResendEmail({ member });
                          },
                        },
                        {
                          key: "edit",
                          label: "Edit",
                          onClick: () => {
                            modalOpen({ edit_member: member });
                          },
                        },
                        ...(member.link && false
                          ? [
                              {
                                key: "link",
                                label: "Goto Link",
                                onClick: () => {
                                  member.link &&
                                    // router.replace(
                                    //   member.link as unknown as URL,
                                    // );
                                    window.location.replace(
                                      member.link as unknown as URL,
                                    );
                                },
                              },
                            ]
                          : []),
                      ]}
                    />
                  );
                })
              ) : (
                <span style={{ color: "white" }}>Please add some people</span>
              )}
            </div>
          </div>
          <div
            className="m-10"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button
              isDisabled={emailSendAll.isLoading}
              isLoading={emailSendAll.isLoading}
              text="Resend All Emails"
              onClick={async () => {
                onMembersResendAllEmails();
              }}
            />
          </div>
          <p className="font-light text-white">
            Tap the options on the person to edit or resend the email
          </p>
        </Spin>
      </div>
    </LayoutPage>
  );
}
