import { Card, Form, Input, Modal, Spin, Button as AntButton } from "antd/lib";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "~/components/Button";
import CheckAuth from "~/components/CheckAuth";
import LayoutPage from "~/layouts/LayoutPage";
import { api } from "~/utils/api";
import { type member } from "@prisma/client";

export default function Match() {
  // url params
  const router = useRouter();
  const id = router.query.id as string;
  const pwd = router.query.pwd as string;

  // requests
  const group = api.group.get.useQuery(
    { id, pwd },
    { enabled: id ? true : false && pwd ? true : false, staleTime: Infinity },
  );
  const memberAdd = api.group.member_add.useMutation();
  const memberRemove = api.group.member_remove.useMutation();
  const membersMakeSantas = api.group.members_make_santas.useMutation();

  // form
  const [formAddPerson] = Form.useForm<member & { is_edit?: boolean, pwd?: string }>();

  // states
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("Add Person");

  // functions
  const modalOpen = useCallback(
    (args: { edit_member?: member }) => {
      formAddPerson.resetFields();
      setModalTitle("Add Person");
      if (args.edit_member) {
        formAddPerson.setFieldsValue(args.edit_member);
        formAddPerson.setFieldValue("is_edit", true);
        setModalTitle("Edit Person");
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

  const onMemberRemove = useCallback(
    (args: { id: string }) => {
      const group_id = id;
      const member_id = args.id;
      if (group_id && member_id) {
        memberRemove
          .mutateAsync({
            member_id,
            group_id,
            pwd,
          })
          .then(async (res) => {
            if (res) {
              toast.success(`Successfully removed member`);
              await group.refetch();
            }
          })
          .catch((e) => {
            toast.error("Failed to remove user");
            console.error(e);
          });
      }
    },
    [id, group, pwd],
  );

  const onMembersMakeSantas = useCallback(
    async (args: { is_rematch?: boolean }) => {
      const group_id = id;
      if (group_id && pwd) {
        if (group.data?.is_matched === true && args.is_rematch !== true) {
          await router.push({
            pathname: "/group/final",
            query: { id, pwd },
          });
        }
        if (!group.data?.members) {
          toast.error(`Please add people first`);
          return;
        }

        if (group.data.members?.length <= 2) {
          toast.error(`Please have atleast 3 people`);
          return;
        }
        toast.info(`Matching and Emailing Santas`);
        async function onMatch() {
          await router.push({
            pathname: "/group/final",
            query: { id, pwd },
          });
          await group.refetch();
        }
        membersMakeSantas
          .mutateAsync({
            group_id,
            pwd,
            is_rematch: args.is_rematch,
          })
          .then(async (res) => {
            if (!res.isError === true) {
              toast.success(res.message ?? `Successfully assigned santa`);
              await onMatch();
            } else {
              toast.error(res.message);
              if (res.is_matched) {
                await onMatch();
              }
            }
          })
          .catch((e) => {
            toast.error("Failed to assign santas");
            console.error(e);
          });
      }
    },
    [id, group.data, pwd],
  );
  useEffect(() => {
    if (group.data?.is_matched) {
      void router.push({
        pathname: "/group/final",
        query: { id, pwd },
      });
    }
  }, [group.data, router]);
  return (
    <LayoutPage pageTitle="Group - Match">
      <CheckAuth />
      <Modal
        open={modalIsOpen}
        centered
        onCancel={() => {
          setModalIsOpen(false);
        }}
        onOk={() => {
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
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, max: 15 }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="email"
              rules={[{ required: true, type: "email" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item hidden>
              <AntButton htmlType="submit">Submit</AntButton>
            </Form.Item>
          </Form>
        </Card>
      </Modal>
      <div className="container flex flex-col justify-start text-center text-white">
        <Spin
          spinning={
            !group.data ||
            group.isLoading ||
            memberRemove.isLoading ||
            membersMakeSantas.isLoading
          }
        >
          <div className="text-center text-white">
            <p className="py-2.5  text-2xl text-white">
              Add people to your Secret Santa group
            </p>
            <p className="py-2.5 font-light">Randomly assign Secret Santas</p>
          </div>
          <div
            style={{
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
                      onClick={() => {
                        // modalOpen();
                      }}
                      menuOptions={[
                        {
                          key: "delete",
                          label: "delete",
                          onClick: ({ id }) => {
                            onMemberRemove({ id });
                          },
                        },
                        {
                          key: "edit",
                          label: "Edit",
                          onClick: () => {
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
            {group.data?.is_matched ? (
              <>
                Group is already matched
                <br />
                We can't add anymore people
              </>
            ) : (
              <Button
                text="+ Add Person"
                onClick={() => {
                  modalOpen({});
                }}
              />
            )}
          </div>
          <div
            className="m-2"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button
              text={
                group.data?.is_matched
                  ? "Group already Matched, Continue"
                  : "Continue and Random Match"
              }
              isInverted
              onClick={async () => {
                await onMembersMakeSantas({});
              }}
            />
          </div>
        </Spin>
      </div>
    </LayoutPage>
  );
}
