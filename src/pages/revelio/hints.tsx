import { Card, Form, Input, Modal, Spin, Button as AntButton } from "antd/lib";
import { useRouter } from "next/router";
import { useCallback, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Button } from "~/components/Button";
import LayoutPage from "~/layouts/LayoutPage";
import { api } from "~/utils/api";

export default function Hints() {
  // url params
  const router = useRouter();
  const id = router.query.id as string;

  // requests
  const member = api.group.member_get.useQuery(
    { id },
    { enabled: id ? true : false },
  );
  const hintsUpdate = api.group.member_hints_update.useMutation();
  const hintsSend = api.group.member_hints_send.useMutation();

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
    if (hints.length >= 4) {
      toast.info(`You can only give 4 hints`);
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
          if (!res) {
            toast.error("Failed to update hints");
          }
          toast.success(res.message ?? `Successfully updated your hints`);
          setModalIsOpen(false);
          await member.refetch();
        })
        .catch((e) => {
          toast.error("Failed to update hints");
          console.error(e);
        });
    }
  }, [formAddHint, hints, member]);

  const onHintRemove = useCallback(
    (args: { index: number }) => {
      const _hints: string[] = [];
      hints.map((hint, index) => {
        if (index !== args.index) _hints.push(hint);
      });
      const values = {
        id,
        hints: JSON.stringify(_hints),
      };
      if (values) {
        hintsUpdate
          .mutateAsync(values)
          .then(async (res) => {
            if (!res) {
              toast.error("Failed to update hints");
            }
            toast.success(res.message ?? `Successfully updated your hints`);
            setModalIsOpen(false);
            await member.refetch();
          })
          .catch((e) => {
            toast.error("Failed to update hints");
            console.error(e);
          });
      }
    },
    [id, hints],
  );

  const onContinue = useCallback(async () => {
    if (!hints || hints.length < 1) {
      await router.push({ pathname: "/revelio/grinch", query: { id } });
    }
    hintsSend
      .mutateAsync({ id })
      .then(async (res) => {
        if (res.isError) {
          toast.error(res.message);
          return;
        }
        toast.success(res.message);
        await router.push({ pathname: "/revelio/grinch", query: { id } });
      })
      .catch((e) => {
        toast.error("Failed to send hints to santa");
        console.error(e);
      });
  }, [id, router, hints]);

  useEffect(() => {
    const hints = member.data?.hints;
    if (hints) {
      const hintsArray = JSON.parse(hints) as unknown as string[];
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
        okButtonProps={{
          type: "primary",
        }}
        onOk={() => {
          formAddHint.submit();
        }}
        closable={false}
      >
        <Card
          title={hintsUpdate.isLoading ? "Updating" : modalTitle}
          loading={hintsUpdate.isLoading}
        >
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
            <Form.Item hidden>
              <AntButton htmlType="submit">Submit</AntButton>
            </Form.Item>
          </Form>
        </Card>
      </Modal>
      <LayoutPage pageTitle="Revelio - Hints">
        <Spin spinning={!member.data || member.isLoading}>
          <div className="text-center text-white">
            <p className="py-2.5 text-3xl font-bold text-white">
              <strong>{member?.data?.name}</strong> Hold up!
            </p>
            <p className="py-2.5">
              Before you know who <strong>You</strong> will be gifting this year
              <br />
              Would you like to give hints of what you want to your Secret
              Santa? 😉
            </p>
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
              {hints.length > 0 ? (
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
                          onClick: () => {
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
              isLoading={hintsSend.isLoading}
              text={`${hintsSend.isLoading ? "" : ">"} ${
                !hints || hints.length < 1
                  ? "Dont give hints, Let's continue"
                  : `${
                      hintsSend.isLoading ? "Whispering" : "Whisper"
                    } Hints to Santa`
              }`}
              isInverted
              onClick={async () => {
                await onContinue();
              }}
            />
          </div>
        </Spin>
      </LayoutPage>
    </>
  );
}
