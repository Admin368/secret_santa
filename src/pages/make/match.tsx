import { useRouter } from "next/router";
import Input from "postcss/lib/input";
import { Button } from "~/components/Button";

export default function match() {
    const router = useRouter();
    const content = (
    <div>
        <p>edit</p>
        <p>delete</p>
    </div>);
    return (
        <div className="container text-center text-white flex flex-col justify-start ">
            <div className="text-white text-center">
                <p className="text-white  text-2xl py-2.5">Create new link</p>
                <p className="py-2.5 font-light">Randomly assign Secret Santas</p>
            </div>
            <div className="border h-75 w-75 flex flex-col rounded-md text-black">
                <button className="bg-white p-2 ml-2 mr-2 mt-2 rounded-lg font-bold">
                    <div className="flex flex-row justify-center ">
                        <div>
                            <p>JINGLE</p>
                            <p className="font-light text-xs">jingle@bells.com</p>
                        </div>
                        
                    </div>
                </button>
                
                <button className="bg-transparent p-2 m-2 border rounded-lg font-bold text-white"><p>+ Add person</p></button>
            </div>
            
            <div className="m-2">
                <Button
                    text="Random Match"

                    onClick={async () => {
                        await router.push("/make/final");
                    }}
                />
            </div>
        </div>
    )
}
