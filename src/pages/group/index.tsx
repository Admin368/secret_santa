import { Button } from "~/components/Button";
import { Text } from "~/components/Text";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { toast } from "react-toastify";
import LayoutPage from "~/layouts/LayoutPage";
import Card from "antd/lib/card";
import Form from "antd/lib/form";
import Input from "antd/lib/input";
import Modal from "antd/lib/modal";
import AntButton from "antd/lib/button";
import { useCallback, useState } from "react";
import Logo from "~/components/Logo";
import { useRecoilValue } from "recoil";
import { stateColor } from "~/states";

export default function Page() {
  // states
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const color = useRecoilValue(stateColor);
  // navigation
  const router = useRouter();

  // form
  const [formGroupCreate] = Form.useForm<{
    group_name: string;
    name: string;
    email: string;
  }>();

  // api
  const groupCreate = api.group.create.useMutation();

  // functions
  const onModalOpen = useCallback(() => {
    setModalIsOpen(true);
  }, []);
  const onModalClose = useCallback(() => {
    setModalIsOpen(false);
  }, []);
  const handleGroupCreate = useCallback(async () => {
    const values = formGroupCreate.getFieldsValue();
    const name = values.name;
    const email = values.email;
    const group_name = values.group_name;
    if (!name) {
      toast.error("Please Provide a name for your group");
      return;
    }
    await groupCreate
      .mutateAsync({ name, email, group_name })
      .then(async (res) => {
        onModalClose();
        if (res.group) {
          toast.success(res.message);
          await router.push(
            `/group/link?id=${res.group.id}&pwd=${res.group.password}`,
          );
        } else {
          toast.error(res.message);
        }
      })
      .catch((e) => {
        console.error(e);
        toast.error("Failed to create link");
      });
  }, [formGroupCreate]);

  // effects

  return (
    <LayoutPage>
      <Modal
        open={modalIsOpen}
        centered
        onCancel={onModalClose}
        onOk={handleGroupCreate}
        closeIcon={null}
      >
        <span
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            gap: 5,
          }}
        >
          <Logo textColor={color ?? "black"} />
          <Card
            title={`${groupCreate.isLoading ? "Creating" : "Create"} new group`}
            loading={groupCreate.isLoading}
            style={{ width: "100%" }}
          >
            <Form
              form={formGroupCreate}
              onFinish={handleGroupCreate}
              style={{ padding: 10 }}
            >
              <Form.Item
                name={"group_name"}
                label={"Group Name"}
                rules={[{ required: true, max: 30 }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name={"name"}
                label={"Your Name"}
                rules={[{ required: true, max: 30 }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name={"email"}
                label={"Your Email"}
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item hidden>
                <AntButton htmlType="submit" />
              </Form.Item>
            </Form>
          </Card>
        </span>
      </Modal>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          paddingTop: 20,
          gap: 20,
          alignItems: "center",
        }}
      >
        <Text text="Randomly assign your friends to for secret santa" />
        <Text text="List the names of the people participating  and we’ll randomly assign their secret santa." />
        <Text text="And they will receive their secret receiver by emails" />
        <Button
          isLoading={groupCreate.isLoading}
          isDisabled={groupCreate.isLoading}
          text="Create Santa List"
          isInverted
          onClick={async () => {
            onModalOpen();
          }}
        />
      </div>
    </LayoutPage>
  );
}
