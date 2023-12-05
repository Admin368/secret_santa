import { useRouter } from "next/router"

export default function hints() {
    const router = useRouter();
    return (
        <div className="container text-center flex flex-col justify-start">
            <div className="text-white text-center">
                <p className="text-white font-bold text-2xl py-2.5">SANTA Hold up!</p>
                <p className="py-2.5">Before you know who you will be gifting this year</p>
                <p className="py-2.5">Would you like to give hints to your Secret Santa about your wish list 😉</p>
            </div>
            <div className="border h-50 w-50 flex flex-col rounded-md">
                <button className="bg-white p-2 ml-2 mr-2 mt-2 rounded-lg font-bold"><p>PS5</p></button>
                <button className="bg-white p-2 ml-2 mr-2 mt-2 rounded-lg font-bold"><p>PERFUMES</p></button>
                <button className="bg-transparent p-2 m-2 border rounded-lg font-bold text-white"><p>+ Add Hint</p></button>
            </div>
            <button 
            onClick={async ()=>{await router.push("/grinch/revelio")}}
            className="text-center bg-transparent p-2 m-4 border rounded-lg font-bold text-white">
                <p>Continue</p>
            </button>
        </div>
    )
}

