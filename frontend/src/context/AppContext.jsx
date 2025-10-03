import { createContext, useEffect, useState } from "react"
import { toast } from "react-toastify"

const AppContext = createContext()

const AppContextProvider = ({ children }) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [isLogged, setIsLogged] = useState(false)
    const [userData, setUserData] = useState(false)
    const [loading, setLoading] = useState(false)

    const getUserData = async () => {
        try {
            setLoading(true)
            const res = await fetch(`${backendUrl}/api/users/get-user`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            })

            if(res.ok) {
                const data = await res.json()
                setUserData(data)
                setIsLogged(true)
                setLoading(false)
            }
            else {
                setLoading(false)
            }
        } catch (error) {
            console.log(error.message)
        }
        setLoading(false)
    }

    const value = {
        backendUrl, 
        isLogged, setIsLogged,
        userData, setUserData,
        loading, setLoading,
        getUserData
    }

    useEffect(() => {
        getUserData()
    }, [])

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export {
    AppContext, 
    AppContextProvider
}