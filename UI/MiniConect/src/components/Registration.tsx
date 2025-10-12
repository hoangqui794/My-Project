import React, { useState } from "react";

const Registration: React.FC = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Registering user:", formData);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto bg-white p-8 rounded shadow"
        >
            <h2 className="text-2xl font-bold mb-6 text-center">Đăng ký</h2>
            <div className="mb-4">
                <label htmlFor="username" className="block mb-1 font-medium">Username:</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="email" className="block mb-1 font-medium">Email:</label>
                <input
                    type="text"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                />
            </div>
            <div className="mb-6">
                <label htmlFor="password" className="block mb-1 font-medium">Password:</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                />
            </div>
            <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
            >
                Register
            </button>
        </form>
    );
};

export default Registration;