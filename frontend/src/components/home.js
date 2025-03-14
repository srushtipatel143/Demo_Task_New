import 'bootstrap/dist/css/bootstrap.min.css';
import { dataconfig } from '../config/config';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import "../css/signup.css";
import { toast } from "react-toastify";
import { useEffect, useState } from 'react';

async function postImage({ image, token }) {
    const formData = new FormData();
    formData.append("image", image)
    //formData.append("token", token)
    const result = await axios.post(`${dataconfig.apiBaseUrl}/api/auth/user/images`, formData, { 
        headers: { 
            'Content-Type': 'multipart/form-data' ,
            'Authorization': `Bearer ${token}`
        } ,
    })
    return result.data
}

const Home = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState();
    
    useEffect(() => {
        const fetchToken = async () => {
            try {
                if (localStorage.getItem("googleSignUp")) {

                    const response = await axios.get(`${dataconfig.apiBaseUrl}/api/auth/user/get-token`, {
                        withCredentials: true
                    });
                    if (response.data.token) {
                        localStorage.setItem("token", response.data.token);
                        localStorage.removeItem("googleSignUp");
                        navigate("/home")
                    }
                    else {
                        toast.error("Something went wrong");
                    }
                }
            } catch (error) {
                toast.error("Error fetching token:", error);
            }
        }
        fetchToken();
    }, [navigate]);

    const submit = async (e) => {
        console.log("click")
        try {
            e.preventDefault();
            const token = localStorage.getItem("token");

            const result = await postImage({ image: file, token })
            if (result.success) {
                navigate("/list");
            }
        } catch (error) {
            toast.error("Something went wrong");
        }

    }

    const fileSelected = (e) => {
        const file = e.target.files[0];
        setFile(file);
    }
    return (
        <>
            <div className="App">
                <form onSubmit={submit}>
                    <input onChange={fileSelected} type="file" accept="image/*"></input>
                    <button type="button" onClick={submit}>Submit</button>
                    <button type="button" onClick={()=>{
                        navigate("/list")
                    }}>List Page</button>
                </form>
            </div>
        </>
    )
}

export default Home;