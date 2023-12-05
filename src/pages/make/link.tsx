import { useRouter } from "next/router"
import { Button } from "~/components/Button";

export default function link() {
    const router = useRouter();
    return (
        <div className="container text-center text-white flex flex-col justify-start items-center">
            <div className="text-white text-center">
                <p className="text-white  text-2xl py-2.5">Create new link</p>
                <p className="py-2.5 font-light">Please copy and keep this link to view the details later.</p>
            </div>
            <div className="border h-50 w-50 flex flex-col rounded-md items-center p-2">
                <p className="mb-0">Link:</p>
                <p className="font-light mt-0">https://adhd</p>
                <p className="mb-0">Password:</p>
                <p className="font-light mt-0">AnnieAreYouOkay</p>
                <div className="mt-2">
                    <Button
                    
                        text="Copy Link"
                        isInverted
                        onClick={async () => {
                            await router.push("/make/link");
                        }}
                    />
                </div> </div>
                <p className="font-light">This is only for the <span className="font-semibold">link maker</span></p>
                <p>😉</p>
            <div className="m-2">
                <Button
                    text="Add People"
                
                    onClick={async () => {
                        await router.push("/make/match");
                    }}
                />
            </div>
        </div>
    )
}
