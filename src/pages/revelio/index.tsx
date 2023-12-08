import type { member } from "@prisma/client";
import { useRouter } from "next/router";
import { Button } from "~/components/Button";
import { api } from "~/utils/api";
import { LoadingOutlined } from "@ant-design/icons";
import LayoutPage from "~/layouts/LayoutPage";
function SantaAlreadyKnows() {
  const router = useRouter();
  return (
    <p
      className="py-2.5 text-2xl font-bold text-white"
      style={{
        lineHeight: 1.5,
      }}
    >
      👀 Santa,
      <br />
      We already told you who you are gifting
      <br />
      You can ask the link maker to resend the email if you forgot
      <br />
      If its not your link, dont cheat or will see you in Azkaban
      <Button
        text="Make a new Secret Santa group"
        isInverted
        onClick={async () => {
          await router.push("/");
        }}
      />
    </p>
  );
}
function DontKnowSanta() {
  const router = useRouter();
  return (
    <p
      className="py-2.5 text-2xl font-bold text-white"
      style={{
        lineHeight: 1.5,
      }}
    >
      👀 Santa ?
      <br />
      I think NOT
      <br />
      We Dont know you Muggle
      <br />
      <Button
        text="Make a new secret santa group"
        isInverted
        onClick={async () => {
          await router.push("/");
        }}
      />
    </p>
  );
}

function KnowSanta(props: { member: member; id: string }) {
  const router = useRouter();
  return props.member.link_is_seen ? (
    <SantaAlreadyKnows />
  ) : (
    <>
      <div>
        <p className="py-2.5 text-3xl font-bold text-white">
          Welcome,
          <br /> {`Santa ${props.member.name}`}
        </p>
        <p className="py-2.5 text-2xl">
          You have been chosen to be somebody's secret santa😉
        </p>
      </div>
      <div>
        <button
          onClick={async () => {
            await router.push({
              pathname: "/revelio/hints",
              query: { id: props.id },
            });
          }}
          className="h-48 w-48 rounded-full border bg-transparent p-6 "
        >
          <p className="text-5xl font-extrabold text-white">FIND OUT</p>
        </button>
      </div>
      <p className="py-2.5 text-2xl">
        Who You will be <br /> 🎁Gifting this year?🎁
      </p>
    </>
  );
}

function WeHaveId({ id }: { id: string }) {
  const member = api.group.member_get.useQuery(
    { id },
    { enabled: id ? true : false },
  );
  return (
    <>
      {!member.isFetched ? (
        <span>
          Looking for Santa on the
          <br />
          🐾 Marauders Map 🐾
          <br /> <LoadingOutlined />
        </span>
      ) : member.isFetched && member.data ? (
        <KnowSanta member={member.data} id={id} />
      ) : (
        <DontKnowSanta />
      )}
    </>
  );
}

interface TypeQuery {
  id?: string;
}
export async function getServerSideProps(context: { query: TypeQuery }) {
  const query = context.query;
  const id = query.id ?? null;
  return {
    props: {
      id,
    },
  };
}

export default function Index({ id }: { id?: string }) {
  return (
    <LayoutPage pageTitle="Revelio - Hints">
      {id ? <WeHaveId id={id} /> : <DontKnowSanta />}
    </LayoutPage>
  );
}
