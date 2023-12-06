import { useRouter } from 'next/router'
import React from 'react'

export default function final() {
    const router = useRouter();
    return (
        <div className="container w-80 text-center flex flex-col justify-start">
            <div className="text-white text-center">
                <p className="text-white font-bold text-2xl py-2.5">Behold your links</p>
                <p className="py-2.5 font-light">The Santas have been notified.
                    Please notify them to check their emails & trash</p>
            </div>
            <div className="border h-50 w-50 flex flex-col rounded-md">
                <button className="bg-white p-2 ml-2 mr-2 mt-2 rounded-lg font-bold">
                    <div className="flex flex-row justify-center ">
                        <div>
                            <p>JINGLE</p>
                            <p className="font-light text-xs">jingle@bells.com</p>
                        </div>
                        <p className="ml-10">...</p>
                    </div>
                </button>
                <button className="bg-white p-2 ml-2 mr-2 mb-2 mt-2 rounded-lg font-bold">
                    <div className="flex flex-row justify-center ">
                        <div>
                            <p>JINGLE</p>
                            <p className="font-light text-xs justify-end" >jingle@bells.com</p>
                        </div>
                        <p className="ml-10">...</p>
                    </div>
                </button>
                 </div>
            <button
                onClick={async () => { await router.push("/grinch/revelio") }}
                className="text-center bg-transparent p-2 m-4 border rounded-lg font-bold text-white">
                <p>Resend All Emails</p>
            </button>
            <p className="font-light text-white">Tap the person to send the email again</p>
        </div>
    )
}
