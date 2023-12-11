
import GithubOutlined from "@ant-design/icons/lib/icons/GithubOutlined";
import LinkedinOutlined from "@ant-design/icons/lib/icons/LinkedinOutlined";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";



export default function creator() {
    const router = useRouter();
    return (
        <div className='container  min-x-auto flex flex-col text-center place-content-center place-items-center text-white'>
            <div>
                <p className='text-2xl font-bold mt-4'>About Us 😎</p>
            </div>
            <div><p className='m-4 font-medium text-lg'>We are a team of developers
                currently studying in Wuhan University of Technology</p></div>
            
            <div className="flex gap-2">
            <div className="">
                <div className="w-40 rounded-lg overflow-hidden shadow-lg  bg-slate-100 text-black">
                    <img className="w-40" src="/creators/paul.jpg" alt="Sunset in the mountains" />
                    <div className="px-6 py-4 bg">
                            <div className="font-bold text-xl mb-2">Paul E. Kachule</div>
                        <p className="text-white-700 text-base">Full-stack developer
                        </p>
                    </div>
                        
                        <div className="flex justify-around">
                            <div className="mb-2">
                                <a href="https://github.com/Admin368" className="mb-2 text-xl">
                                    <GithubOutlined />
                                </a>
                            </div>
                            <div className="mb-2">
                                <a href="https://www.linkedin.com/in/paul-ernest-kachule" className="mb-2 text-xl">
                                    <LinkedinOutlined />
                                </a>
                            </div>
                        </div>

                </div>
            </div>
            <div className="">
                <div className="w-40 rounded-lg overflow-hidden shadow-lg  bg-slate-100 text-black">
                    <img className="w-40" src="/creators/kelwin.jpg" alt="Sunset in the mountains" />
                    <div className="px-6 py-4 bg">
                        <div className="font-bold text-xl mb-2 mr-2 text-center">Kelwin Ndrianasolo</div>
                        <p className="text-white-700 text-base">
                            Full-stack developer
                        </p>
                    </div>
                        <div className="flex justify-around">
                            <div className="mb-2">
                                <a href="https://github.com/KelwinZnhr" className="mb-2 text-xl">
                                    <GithubOutlined />
                                </a>
                            </div>
                            <div className="mb-2">
                                <a href="https://www.linkedin.com/in/a-kelwin-ndrianasolo-1b4350172/" className="mb-2 text-xl">
                                    <LinkedinOutlined />
                                </a>
                            </div>
                        </div>
                </div>
            </div>
                
        </div>
            <div><blockquote className="text-xl italic font-semibold text-gray-900 dark:text-white"><p className='m-4 font-medium text-lg'>"I will honor Christmas in my heart, and try to keep it all the year."- Charles Dickens, A Christmas Carol</p></blockquote></div>
            <div><p className="text-2xl m-2">🎄</p></div>
            <div><Link href={"/"}>
                {router.pathname !== "/" ? (
                    <p
                        style={{
                            padding: 10,
                            fontWeight: 200,
                            color: "white",
                            textAlign: "center",
                            width: "fit-content",
                            whiteSpace: "nowrap",
                            alignSelf: "center",
                        }}
                    >
                        Create your own{" "}
                        <strong style={{ fontWeight: 800 }}>Secret Santa</strong> list
                        <br />
                        Santa.Maravian.com
                    </p>
                ) : null}
            </Link></div>
        </div >

    )
}
