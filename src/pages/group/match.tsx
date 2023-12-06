import { useRouter } from "next/router";
import { Button } from "~/components/Button";

export default function match() {
  const router = useRouter();

  return (
    <div className="container w-80 flex flex-col justify-start text-center text-white ">
      <div className="text-center text-white">
        <p className="py-2.5  text-2xl text-white">Create new link</p>
        <p className="py-2.5 font-light">Randomly assign Secret Santas</p>
      </div>
      <div className="container w-100 flex flex-col rounded-md border text-black">
        <button className="ml-2 mr-2 mt-2 rounded-lg bg-white p-2 font-bold">
          <div className="flex flex-row justify-center ">
            <div>
              <p>JINGLE</p>
              <p className="text-xs font-light">jingle@bells.com</p>
            </div>
          </div>
        </button>

        <button className="m-2 rounded-lg border bg-transparent p-2 font-bold text-white">
          <p>+ Add person</p>
        </button>
      </div>

      <div className="m-2">
        <Button
          text="Random Match"
          onClick={async () => {
            await router.push("/group/final");
          }}
        />
      </div>
    </div>
  );
}
