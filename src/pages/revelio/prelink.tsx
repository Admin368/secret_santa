import Link from "next/link";
import { Button } from "~/components/Button";
import LayoutPage from "~/layouts/LayoutPage";

interface TypeQuery {
  link?: string;
}
export async function getServerSideProps(context: { query: TypeQuery }) {
  const query = context.query;
  const link = query.link ?? null;
  return {
    props: {
      link: link ?? null,
    },
  };
}
export default function PreLink({ link }: { link: string }) {
  return (
    <LayoutPage pageTitle="Group - Prelink">
      {link ? (
        <>
          You have been sent a link to find you whose secret santa you will be
          <Link href={link} target="_blank">
            <Button text="Open link" />
          </Link>
        </>
      ) : (
        <span>Please provide a link</span>
      )}
    </LayoutPage>
  );
}
