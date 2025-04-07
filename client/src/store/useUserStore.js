import toast from "react-hot-toast";
import {create} from "zustand"

export const useUserStore = create((set, get) => ({
    getProfile : async (userId) => {
        try {
            const response = await axiosInstance.get(`/user/${userId}`);
            return response.data.user;
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Cant Fetch Profile")
        }
    },
})) 
