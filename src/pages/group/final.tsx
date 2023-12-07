// import { group } from "@prisma/client";
import { Card, Form, Input, Modal, Spin } from "antd/lib";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "~/components/Button";
import CheckAuth from "~/components/CheckAuth";
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
  const memberType = group.data?.members[0];
  const memberAdd = api.group.member_add.useMutation();
  // const memberSendEmail = api.group.member_add.useMutation();
  // const memberRemove = api.group.member_remove.useMutation();
  // const membersMakeSantas = api.group.members_make_santas.useMutation();

  // form
  const [formAddPerson] = Form.useForm<
    typeof memberType & { is_edit?: boolean }
  >();

  // states
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("Add Person");

  // functions
  const modalOpen = useCallback(
    (args: { edit_member?: typeof memberType }) => {
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
          console.log(res);
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
    (args: { member: typeof memberType }) => {
      const group_id = args.member?.group_id;
      const member = args.member;
      if (group_id && pwd && member) {
      }
    },
    [id, group, pwd],
  );

  const onMembersResendAllEmails = useCallback(() => {
    const group_id = id;
    if (group_id && pwd) {
    }
  }, [id, group, pwd]);

  // useEffects
  useEffect(() => {
    // [] CHECK IF GROUP MATCHED
    // const group_ = group.data;
    // if (group_) {
    //   if (group_.is_matched !== true) {
    //     toast.error("This group is not yet matched");
    //     window.setTimeout(() => {
    //       void router.push({
    //         pathname: "/group/match",
    //         query: {
    //           id,
    //           pwd,
    //         },
    //       });
    //       return true;
    //     }, 1000);
    //   }
    // }
  }, [group.data, id, pwd]);
  return (
    <>
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
              The Santas have been notified. Please notify them to check their
              emails & trash
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
                // flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                width: "100%",
                height: "fit-content",
                maxHeight: "50vh",
                overflow: "auto",
                gap: 5,
                // border: `1px solid white`,
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
                      onClick={() => {
                        // modalOpen();
                      }}
                      menuOptions={[
                        {
                          key: "email_send",
                          label: "Resend Email",
                          onClick: ({ id }) => {
                            console.log(id);
                            onMemberResendEmail({ member });
                          },
                        },
                        {
                          key: "edit",
                          label: "Edit",
                          onClick: (id) => {
                            console.log(id);
                            modalOpen({ edit_member: member });
                          },
                        },
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
              text="Resend All Emails"
              onClick={async () => {
                onMembersResendAllEmails();
              }}
            />
          </div>
          <p className="font-light text-white">
            Tap the options on the person to resend the email
          </p>
        </Spin>
      </div>
    </>
  );
}
