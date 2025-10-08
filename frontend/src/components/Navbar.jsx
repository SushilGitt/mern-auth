import { useNavigate } from "react-router-dom"
import { assets } from "../assets/assets"
import { useContext, useEffect } from "react"
import { AppContext } from "../context/AppContext"
import { toast } from "react-toastify"

const Navbar = () => {
    // React Router hook for programmatic navigation
    const navigate = useNavigate()
    
    // Accessing global state from context
    const {userData, backendUrl, setUserData, setIsLogged, getUserData} = 
    useContext(AppContext)


    // Send verification OTP email
    const sendVerificationOtp = async () => {
        try {
            const res = await fetch(`${backendUrl}/api/users/send-verify-otp`,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include" // send cookies along with request 
            })

            const data = await res.json()

            if(res.ok) {
                // if success -> navigate to email verification page
                toast.success(data.message)
                navigate("/email-verify")
            }
            else {
                // if failed -> show error toast
                toast.error(data.message)
            }

        } catch (error) {
            // Catch network/server errors
            toast.error(error.message)
        }
    }

    // Function: Logout user
    const logout = async() => {
        try {
            const res = await fetch(`${backendUrl}/api/users/logout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include" // send cookies (to clear session)
            })

            const data = await res.json()

            if(res.ok) {
                setIsLogged(false) // update auth state
                setUserData(false) // clear user data
                getUserData()
                navigate("/login", {replace: true})     // redirect to login page
                toast.success(data.message)
            }
            else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0">

            {/* Logo */}
            <img onClick={() => navigate("/")} src={assets.logo} alt="logo" className="w-28 sm:w-32 cursor-pointer" />

            {userData ? 
            <div className="w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group">
                {userData.name[0].toUpperCase()}
                <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10">
                    <ul className="list-none m-0 p-2 bg-gray-100 text-sm">

                        {!userData.isAccountVerified && 
                        <li onClick={sendVerificationOtp} className="py-1 px-2 hover:bg-gray-200 cursor-pointer">Verify email</li>
                        }
                        
                        <li onClick={logout} className="py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10">Logout</li>
                    </ul>
                </div>
            </div> 
            : 
            <button onClick={() => navigate("/login")}
            className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 cursor-pointer hover:bg-gray-100 transition-all">Login <img src={assets.arrow_icon} alt="arrow-icon" />
            </button>}

            
        </div>
    )
}

export default Navbar