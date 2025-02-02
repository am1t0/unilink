import {create} from "zustand"
import axios from "axios"
import { axiosInstance } from "../lib/axios"

export const useAuthStore = create((set) => ({
    authUser: null,
    checkingAuth: true,
    loading: false,

    checkAuth : async () => {
        try {
            set({checkingAuth : true})
            const res = await axiosInstance.get("/auth/me")
            set({authUser : res.data.user})
        } catch (error) {
            set({authUser : null})
        }finally{
            set({checkingAuth : false})
        }
    },

    registerUser : async (data) => {
        try {
            set({loading: true})
            const res = await axiosInstance.post("/auth/register", data)
            set({authUser : res.data.user})
        } catch (error) {
            set({authUser: null})
        }finally{
            set({loading: false})
        }
    },
    loginUser : async (loginData) => {
        try {
            set({ loading: true });
            const res = await axiosInstance.post("/auth/login", loginData);
            set({ authUser: res.data.user });
          } catch (error) {
            set({ authUser: null });
          } finally {
            set({ loading: false });
          }
    }
}))