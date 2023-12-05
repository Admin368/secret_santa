import { useEffect, useState } from "react";
import React from "react";

export default function revelio() {
    function TextDisplay() {
        const [text, setText] = useState(revealing[0]);

        let index = 0;

        function changeText(): void {
            setText(revealing[index]);

            index++;
            if (index >= revealing.length) {
                index = 0;
            }
        }

        useEffect(() => {
            const timer = setInterval(changeText, 4000);
            return () => clearInterval(timer);
        }, []);

        return <p className=" text-white font-bold text-2xl py-2.5">{text}</p>;
    }




    const revealing = [
        "Welcome,You are about to discover the identity of the person you will be gifting this year.",
        "The moment of truth has arrived!Are you ready to find out who your Secret Santa is ? ",
        "You have been chosen to be the Secret Santa for",]


    return (
        <div className=" min-h-screen container text-white text-center flex flex-col justify-center items-center">
            {TextDisplay()}
        </div>
    )
}
