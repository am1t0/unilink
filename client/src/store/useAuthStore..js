import {create} from "zustand"
import axios from "axios"

export const useAuthStore = create((set) => ({
    authUser: null,
    checkingAuth: true,
    loading: false,

    checkAuth : async () => {
        try {
            const res = await axios.get("http://localhost:3001/api/v1/auth/me",{
                withCredentials:true
            })
            set({authUser : res.data.user})
            console.log("Authenticated User:", useAuthStore.getState().authUser);
        } catch (error) {
            set({authUser : null})
        }finally{
            set({checkingAuth : false})
        }
    },

    registerUser : async (data) => {
        try {
            console.log(data)
            const res = await axios.post("http://localhost:3001/api/v1/auth/register", data,{
                withCredentials: true,
            })
            set({authUser : res.data.user})
        } catch (error) {
            console.log("Error response:", error.response?.data);
            set({authUser: null})

        }
    }
}))