// import { group } from "@prisma/client";
import { Card, Form, Input, Modal, Spin } from "antd/lib";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "~/components/Button";
import CheckAuth from "~/components/CheckAuth";
import { api } from "~/utils/api";

export default function match() {
  // url params
  const router = useRouter();
  const id = router.query.id as string;
  const pwd = router.query.pwd as string;

  // requests
  const group = api.group.get.useQuery(
    { id, pwd },
    { enabled: id ? true : false && pwd ? true : false, staleTime: Infinity },
  );
  const memberType = group.data?.members[0];
  const memberAdd = api.group.member_add.useMutation();
  const memberRemove = api.group.member_remove.useMutation();
  const membersMakeSantas = api.group.members_make_santas.useMutation();

  // form
  const [formAddPerson] = Form.useForm<typeof memberType>();

  // states
  const [modalIsOpen, setModalIsOpen] = useState(false);

  // functions
  const modalOpen = useCallback(
    (args: { edit_member?: typeof memberType }) => {
      formAddPerson.resetFields();
      if (args.edit_member) {
        formAddPerson.setFieldsValue(args.edit_member);
        formAddPerson.setFieldValue("is_edit", true);
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
          toast.success(`Successfully added ${res.name}`);
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
            console.log(e);
          });
      }
    },
    [id, group, pwd],
  );

  const onMembersMakeSantas = useCallback(() => {
    const group_id = id;
    if (group_id && pwd) {
      membersMakeSantas
        .mutateAsync({
          group_id,
          pwd,
        })
        .then(async (res) => {
          if (res) {
            toast.success(`Successfully assigned santa`);
            console.log(res);
            await group.refetch();
          }
        })
        .catch((e) => {
          toast.error("Failed to assign santas");
          console.log(e);
        });
    }
  }, [id, group, pwd]);
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
        <Card title={"Add Person"} loading={memberAdd.isLoading}>
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
      <div
        className="container flex flex-col justify-start text-center text-white"
        // style={{ width: "100%", border: "1px solid red" }}
      >
        <Spin
          spinning={
            !group.data ||
            group.isLoading ||
            memberRemove.isLoading ||
            membersMakeSantas.isLoading
          }
        >
          <div className="text-center text-white">
            <p className="py-2.5  text-2xl text-white">Create new link</p>
            <p className="py-2.5 font-light">Randomly assign Secret Santas</p>
          </div>
          <div
            className="h-75 w-75 flex flex-col rounded-md border text-black"
            style={{
              width: "300px",
              flex: 1,
              alignItems: "center",
              padding: 20,
              gap: 5,
              display: "flex",
              // overflow: "hidden",
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
                height: "50vh",
                // border: "1px solid white",
                overflow: "auto",
                gap: 5,
              }}
            >
              {group.data?.members.map((member, index) => {
                return (
                  <Button
                    id={member.id}
                    key={index}
                    text={member.name}
                    subText={member.email}
                    isInverted
                    onClick={() => {
                      // modalOpen();
                    }}
                    menuOptions={[
                      {
                        key: "delete",
                        label: "delete",
                        onClick: ({ id }) => {
                          console.log(id);
                          onMemberRemove({ id });
                        },
                      },
                      {
                        key: "edit",
                        label: "edit",
                        onClick: (id) => {
                          console.log(id);
                          modalOpen({ edit_member: member });
                        },
                      },
                    ]}
                  />
                );
              })}
              {/* <button className="m-2 rounded-lg border bg-transparent p-2 font-bold text-white">
              <p>+ Add person</p>
            </button> */}
            </div>
            <Button
              text="+ Add Person"
              onClick={() => {
                modalOpen({});
              }}
            />
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
              text="Continue and Random Match"
              isInverted
              onClick={async () => {
                // await router.push("/make/final");
                onMembersMakeSantas();
              }}
            />
          </div>
        </Spin>
      </div>
    </>
  );
}
