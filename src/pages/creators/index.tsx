
import GithubOutlined from "@ant-design/icons/lib/icons/GithubOutlined";
import LinkedinOutlined from "@ant-design/icons/lib/icons/LinkedinOutlined";
import Image from "next/image";



export default function creator() {
    return (
        <div className='container  min-x-auto flex flex-col text-center items-center justify-center text-white'>
            <div>
                <p className='text-2xl font-bold mt-4'>About Us 😎</p>
            </div>
            <div><p className='m-4 font-medium text-lg'>we are a team of developers
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
            <div><p className='m-4 font-medium text-lg'>“Blessed is the season which engages the whole world in a conspiracy of love.” – Hamilton Wright Mabie </p></div>
            <div><p className="text-2xl m-2">🎄</p></div>
        </div >

    )
}
