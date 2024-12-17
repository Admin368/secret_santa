import FormItem from "antd/lib/form/FormItem";
import Modal from "antd/lib/modal/Modal";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import Card from "antd/lib/card/Card";
import Button from "antd/lib/button";
import Input from "antd/lib/input";
import Form from "antd/lib/form";
import { api } from "~/utils/api";
import { toast } from "react-toastify";

export interface CheckAuthProps {
  isIdEditble?: boolean;
  isModal?: boolean;
  onSuccess?: {
    redirectUrl?: string;
  };
}
export default function CheckAuth(props: CheckAuthProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const id = router.query.id as string;
  const pwd = router.query.pwd as string;
  const [form] = Form.useForm<{ id: string; pwd: string }>();
  const onLogin = useCallback(async () => {
    const query = form.getFieldsValue();
    await router.push({
      pathname: props?.onSuccess?.redirectUrl ?? undefined,
      query: {
        id: query.id,
        pwd: query.pwd,
      },
    });
  }, [form]);
  const auth = api.group.auth.useQuery(
    { id, pwd },
    { enabled: id && pwd ? true : false, refetchInterval: 300000 },
  );
  useEffect(() => {
    form.setFieldValue("id", id);
    form.setFieldValue("pwd", pwd);
    if (
      id &&
      pwd &&
      auth.data?.isAuth !== undefined &&
      auth.data.isAuth === true
    ) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }, [id, pwd, auth]);
  useEffect(() => {
    const data = auth.data;
    if (data) {
      if (data.isAuth !== true) toast.error("Wrong Password");
      form.setFields([
        {
          name: "pwd",
          errors: ["Wrong Password"],
        },
      ]);
    }
  }, [auth.data]);
  const MainComponent = () => (
    <Card title={"Secret Santa - Password"} loading={auth.isFetching}>
      <Form form={form} onFinish={onLogin}>
        <Form.Item name={"id"} label="Id">
          <Input disabled={props.isIdEditble ? !props.isIdEditble : true} />
        </Form.Item>
        <FormItem name={"pwd"} label="Password">
          <Input />
        </FormItem>
        <FormItem>
          <Button htmlType="submit" type="primary" size="large">
            Login
          </Button>
        </FormItem>
      </Form>
    </Card>
  );
  return props.isModal !== true ? (
    <Modal
      open={isOpen}
      footer={null}
      style={{ padding: 10 }}
      closable={false}
      centered
    >
      <MainComponent />
    </Modal>
  ) : (
    <MainComponent />
  );
}
