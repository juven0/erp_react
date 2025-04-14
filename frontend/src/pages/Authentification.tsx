import LoginForm from "@/components/logi-form"
import RegisterForm from "@/components/register-form"
import { useAuthView } from "@/context/AuthContext";


const Authentification = ()=>{
    const { view } = useAuthView();
    return(<div className="flex h-full w-full justify-center items-center min-h-screen bg-slate-50">
        <div className="w-2/3 h-2/3 relative shadow-lg flex" >
            <div className="relative w-1/2 h-full">
            {view === "login" ? <LoginForm /> : <RegisterForm />}
            </div>
            <div className="relative w-1/2 h-full bg-purple-500"></div>
        </div>
    </div>)
}

export default Authentification