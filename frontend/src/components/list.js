import axios from "axios";
import { useEffect, useState } from "react";
import { dataconfig } from "../config/config";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const List = () => {
    const navigate = useNavigate();
    const [images, setImages] = useState([]); // Ensure it's an array initially

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const responseData = await axios.get(`${dataconfig.apiBaseUrl}/api/auth/user/getImage`, {
                    headers: { 
                        Authorization: `Bearer ${token}` // Pass token in Authorization header
                    } 
                });

                console.log("Response Data:", responseData.data);
                
                // Ensure data is an array before setting state
                setImages(Array.isArray(responseData.data.data) ? responseData.data.data : []);
            } catch (error) {
                toast.error("Something went wrong");
            }
        };

        fetchData();
    }, []); // Run only once on mount

    return (
        <div className="container-fluid">
            <div className="mb-3">
                <button type="button" onClick={() => navigate("/home")}>Home Page</button>
            </div>

            <div>
                {images.length > 0 ? (
                    images.map((item, index) => (
                        <img key={index} src={item.imageName} alt={`Image ${index}`} style={{ width: "250px", height: "250px" }} />
                    ))
                ) : (
                    <p>No images found.</p>
                )}
            </div>

            <ToastContainer />
        </div>
    );
};

export default List;
