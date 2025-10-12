import React, { useState } from "react";
import Login from "../components/Login";
import Register from "../components/Registration";

const AuthForm = () => {
    const [isLogin, setIsLogin] = useState(true);
    const toggleForm = () => {
        setIsLogin((prev) => !prev);
    };
    return (
        <div>
            {isLogin ? <Login /> : <Register />}
            <button onClick={toggleForm}>
                {isLogin ? 'Switch to Registration' : 'Switch to Login'}
            </button>
        </div>
    );

};
export default AuthForm;