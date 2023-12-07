// import { group } from "@prisma/client";
import { Card, Form, Input, Modal, Spin } from "antd/lib";
import { useRouter } from "next/router";
import { useCallback, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Button } from "~/components/Button";
// import CheckAuth from "~/components/CheckAuth";
import { api } from "~/utils/api";

export default function match() {
  // url params
  const router = useRouter();
  const id = router.query.id as string;

  // requests
  const member = api.group.member_get.useQuery(
    { id },
    { enabled: id ? true : false },
  );
  //   const memberType = group.data?.members[0];
  const hintsUpdate = api.group.member_hints_update.useMutation();
  //   const memberRemove = api.group.member_remove.useMutation();
  //   const membersMakeSantas = api.group.members_make_santas.useMutation();

  // form
  const [formAddHint] = Form.useForm<{ id: string; hint: string }>();

  // states
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("Add Hint");

  const [hints, setHints] = useState<string[]>([]);

  // functions
  const onHintAdd = useCallback(() => {
    formAddHint.resetFields();
    setModalTitle("Add Hint");
    formAddHint.setFieldValue("id", id);
    setModalIsOpen(true);
  }, [formAddHint, id]);
  const modalOnSubmit = useCallback(() => {
    const formValues = formAddHint.getFieldsValue();
    const hints_ = hints;
    if (hints.length > 5) {
      toast.info(`You can only give 5 hints`);
      return;
    }
    hints_.push(formValues.hint);
    const values = {
      id,
      hints: JSON.stringify(hints_),
    };
    if (values) {
      hintsUpdate
        .mutateAsync(values)
        .then(async (res) => {
          console.log(res);
          toast.success(`Successfully updated your hints`);
          setModalIsOpen(false);
          await member.refetch();
        })
        .catch((e) => {
          toast.error("failed to update hints");
          console.error(e);
        });
    }
  }, [formAddHint, hints, member]);

  const onHintRemove = useCallback(
    (args: { index: number }) => {
      const hints_ = hints;
      delete hints_[args.index];
      const values = {
        id,
        hints: JSON.stringify(hints_),
      };
      if (values) {
        hintsUpdate
          .mutateAsync(values)
          .then(async (res) => {
            console.log(res);
            toast.success(`Successfully updated your hints`);
            setModalIsOpen(false);
            await member.refetch();
          })
          .catch((e) => {
            toast.error("failed to update hints");
            console.error(e);
          });
      }
    },
    [id, hints],
  );

  const onContinue = useCallback(async () => {
    await router.push({ pathname: "/grinch/revelio", query: { id } });
  }, [id, router]);

  useEffect(() => {
    const hints = member.data?.hints;
    if (hints) {
      console.log("hints", member.data);
      const hintsArray = JSON.stringify(hints) as unknown as string[];
      if (Array.isArray(hintsArray)) {
        setHints(hintsArray);
      }
    }
  }, [member.data]);
  return (
    <>
      <Modal
        open={modalIsOpen}
        centered
        onCancel={() => {
          setModalIsOpen(false);
        }}
        onOk={() => {
          // modalOnSubmit();
          formAddHint.submit();
        }}
        closable={false}
      >
        <Card title={modalTitle} loading={hintsUpdate.isLoading}>
          <Form form={formAddHint} onFinish={modalOnSubmit}>
            <Form.Item name="group_id" label="Group Id" hidden>
              <Input disabled />
            </Form.Item>
            <Form.Item name="id" label="id" hidden>
              <Input disabled />
            </Form.Item>
            <Form.Item name="hint" label="Hint" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Form>
        </Card>
      </Modal>
      <div className="container flex flex-col justify-start text-center text-white">
        <Spin spinning={!member.data || member.isLoading}>
          <div className="text-center text-white">
            <p className="py-2.5 text-2xl font-bold text-white">
              {`SANTA Hold up!`}
            </p>
            <p className="py-2.5">
              Before you know who you will be gifting this year
            </p>
            <p className="py-2.5">
              Would you like to give hints to your Secret Santa about your wish
              list 😉
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
              {hints ? (
                hints.map((hint, index) => {
                  return (
                    <Button
                      id={hint}
                      key={index}
                      text={hint}
                      isInverted
                      width="100%"
                      onClick={() => {
                        // onHintAdd();
                      }}
                      menuOptions={[
                        {
                          key: "delete",
                          label: "delete",
                          onClick: ({ id }) => {
                            console.log(id);
                            onHintRemove({ index });
                          },
                        },
                      ]}
                    />
                  );
                })
              ) : (
                <span style={{ color: "white" }}>Please add some hints</span>
              )}
            </div>
            <Button
              text="+ Add Hint"
              onClick={() => {
                onHintAdd();
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
              text="Enough Hints, Lets Continue"
              isInverted
              onClick={async () => {
                await onContinue();
              }}
            />
          </div>
        </Spin>
      </div>
    </>
  );
}
