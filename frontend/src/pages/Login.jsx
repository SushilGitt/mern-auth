import { useContext, useEffect, useState } from "react"
import { assets } from "../assets/assets"
import {useNavigate } from "react-router-dom"
import { AppContext } from "../context/AppContext"
import { toast } from "react-toastify"

const Login = () => {

    const navigate = useNavigate()

    const {backendUrl,isLogged, loading, setIsLogged, getUserData} = useContext(AppContext)

    const [state, setState] = useState("Sign Up")
    const [btn, setBtn] = useState(false)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    useEffect(() => {
        isLogged && navigate("/", {replace: true})
    }, [isLogged])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setBtn(true)
        try {

            if(state === "Sign Up") {
                const res = await fetch(`${backendUrl}/api/users/register`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({name, email, password}),
                    credentials: "include"
                })

                if(res.ok) {
                    setIsLogged(true)
                    getUserData()
                    navigate("/")
                    const data = await res.json()
                    toast.success(data.message)
                }
                else {
                    const err = await res.json()
                    toast.error(err.message)
                }

            }
            else {
                const res = await fetch(`${backendUrl}/api/users/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({email, password}),
                    credentials: "include"
                })

                if(res.ok) {
                    setIsLogged(true)
                    getUserData()
                    navigate("/")
                    const data = await res.json()
                    toast.success(data.message)
                }
                else {
                    const err = await res.json()
                    toast.error(err.message)
                }
            }

        }
        catch (error) {
            toast.error(error.message)
        }
        setBtn(false)
    }

    if(loading) {
        return (
            <div className="flex justify-center items-center min-h-screen text-xl">
                Loading...
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">

            <img onClick={() => navigate("/")}
            className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
                src={assets.logo} alt="" />

            <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
                <h2 className="text-3xl font-semibold text-white text-center mb-3">
                    {state === "Sign Up" ? "Create Account" : "Login"}
                </h2>

                <p className="text-center text-sm mb-6">
                    {state === "Sign Up" ? "Create your account" : "Login to your account!"}
                </p>

                <form onSubmit={(e) => handleSubmit(e)}>

                    {state === "Sign Up" && (
                        <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333a5c] text-white">
                            <img src={assets.person_icon} alt="" />
                            <input 
                                value={name}
                                onChange={(e) => setName(e.target.value)} 
                                className="bg-transparent outline-none"
                                type="text" placeholder="Full Name" required 
                            />
                        </div>
                    )}


                    <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333a5c] text-white">
                        <img src={assets.mail_icon} alt="" />
                        <input 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-transparent outline-none"
                            type="email" placeholder="Email Id" required />
                    </div>

                    <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333a5c] text-white">
                        <img src={assets.lock_icon} alt="" />
                        <input 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-transparent outline-none"
                            type="password" placeholder="Password" required />
                    </div>

                    <p onClick={() => navigate("/reset-password")}
                       className="mb-4 text-indigo-500 cursor-pointer">
                       Forgot password?
                    </p>

                    <button disabled={btn}  className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium cursor-pointer">{state}</button>

                </form>

                {state === "Sign Up" ? (
                    <p className="text-gray-400 text-center text-xs mt-4">Already have an account?
                        <span onClick={() => setState("Login")} className="text-blue-400 cursor-pointer underline"> Login here</span>
                    </p>
                ) : (
                    <p className="text-gray-400 text-center text-xs mt-4">Don't have an account?
                        <span onClick={() => setState("Sign Up")} className="text-blue-400 cursor-pointer underline"> Sign up</span>
                    </p>
                )}

            </div>
        </div>
    )
}

export default Login