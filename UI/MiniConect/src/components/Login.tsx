import React, { useState } from "react";

const Login: React.FC = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle login logic here
        console.log("Logging in with", { username, password });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            <div>
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />

            </div>
            <div>
                <label htmlFor="password">Password:</label>
                <input type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit">Login</button>
        </form>

    );
};
export default Login;