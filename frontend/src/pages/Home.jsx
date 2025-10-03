import { useContext, useEffect } from "react"
import Header from "../components/Header"
import Navbar from "../components/Navbar"
import { AppContext } from "../context/AppContext"

const Home = () => {

    const {loading} = useContext(AppContext)


    if(loading) {
        return (
            <div className="flex justify-center items-center min-h-screen text-xl">
                Loading...
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[url('/bg_img.png')] bg-cover bg-center">
            <Navbar />
            <Header />
        </div>
    )
}

export default Home