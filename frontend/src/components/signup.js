import 'bootstrap/dist/css/bootstrap.min.css';
import { dataconfig } from '../config/config';
import icon from "../images/google.png"
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import "../css/signup.css";
import { ToastContainer, toast } from "react-toastify";
// import { useEffect } from 'react';

const SignUp = () => {
    const [formData, setFormData] = useState({});
    const [errMsg, setErrMsg] = useState({});
    const navigate = useNavigate();

    // useEffect(() => {
    //     const fetchToken = async () => {
    //         try {
    //             if (localStorage.getItem("googleSignUp")) {
    //                 const response=await axios.get(`${dataconfig.apiBaseUrl}/api/auth/user/get-token`,{
    //                     withCredentials:true
    //                 });
    
    //                 if(response.data.token){
    //                     localStorage.setItem("token",response.data.token);
    //                     localStorage.removeItem("googleSignUp");
    //                     navigate("/home")
    //                 }
    //                 else{
    //                     toast.error("Something went wrong");
    //                 }
    //             }
    //         } catch (error) {
    //             toast.error("Error fetching token:", error);
    //         }
    //     }
    //     fetchToken();
    // }, [navigate]);

    const getValue = (e) => {
        const { name, value } = e.target;
        setFormData(() => ({
            ...formData,
            [name]: value
        }));
        validateField(name, value)
    };

    const validateField = (name, value) => {
        let errors = { ...errMsg };

        switch (name) {
            case "email":
            case "password":
                delete errors[name];
                break;

            default:
                break;
        }
        setErrMsg(errors);
    };

    const validateForm = () => {
        const errors = {};
        const fields = ["email", "password"];

        fields.forEach((val) => {
            if (!formData[val] || formData[val] === "") {
                errors[val] = "*";
            }
        });
        setErrMsg(errors);
        return Object.keys(errors).length === 0;
    };

    const submitForm = async () => {
        try {
            if (validateForm()) {
                const response = await axios.post(`${dataconfig.apiBaseUrl}/api/auth/user/signup`, formData);
                const responsedata = response.data;
                if (response.data.success) {
                    localStorage.setItem("token", responsedata.token);
                    navigate("/home")
                }
            }
        } catch (error) {
            console.log(error);
            toast.error(`${error.response.data.message}`)

        }
    };

    const signUpWithGoogle = () => {
        try {
            localStorage.setItem("googleSignUp", "true");
            window.location.href = `${dataconfig.apiBaseUrl}/api/auth/user/signupwithgoggle`;
        } catch (error) {
            console.log(error);
        }

    };
    return (
        <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center">

            <form className="p-4 border rounded shadow bg-grey bg-opacity-25">
                <div>
                    <button type="button" className="btn btn-outline-dark mt-3 w-100" onClick={signUpWithGoogle}>
                        <img src={icon} className="me-2" alt="icon" style={{ "width": "24px" }} />
                        Sign up with Google
                    </button>
                </div>
                <div className="form-group mt-3">
                    <label htmlFor="email">Email <span className="error-message">{errMsg.email}</span></label>
                    <input type="text" className="form-control" name="email" onChange={getValue} />
                </div>
                <div className="orm-group mt-3">
                    <label htmlFor="email">Password <span className="error-message">{errMsg.password}</span></label>
                    <input type="password" className="form-control" name="password" onChange={getValue} />
                </div>
                <button onClick={submitForm} type="button" className="btn btn-primary mt-3 w-100">Create your account</button>
            </form>
            <ToastContainer />
        </div>
    )
}

export default SignUp;
