import { useRouter } from "next/router"

export default function Index() {
const router = useRouter();
    return (
        <div className="container text-white text-center flex flex-col justify-start">

            <div>
                <p className="text-white font-bold text-4xl py-2.5">Welcome,<br/> Santa Name</p>
                <p className="py-2.5">Find out who you will be gifting this year</p>
            </div>
            <div>
                <button
                onClick={async ()=>{await router.push("/grinch/hints")}}
                    className="w-48 h-48 rounded-full border bg-transparent p-6">
                    <p className="text-5xl font-extrabold text-white">OPEN</p>
                </button>
            </div>
        </div>
    )
}

