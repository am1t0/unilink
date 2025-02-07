import { create } from "zustand"
import axios from "axios"
import { axiosInstance } from "../lib/axios"
import * as yup from "yup";

//validation schema for login
const loginSchema = yup.object().shape({
    email: yup
        .string()
        .email("Please enter a valid email")
        .required("Email is required"),
    password: yup
        .string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
});

//validation schema for register
const registerSchema = yup.object().shape({
    name: yup
        .string()
        .required("Name is required"),
    email: yup
        .string()
        .email("Invalid email")
        .required("Email is required"),
    password: yup
        .string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
});

export const useAuthStore = create((set) => ({
    authUser: null,
    checkingAuth: true,
    loading: false,

    checkAuth: async () => {
        try {
            set({ checkingAuth: true })
            const res = await axiosInstance.get("/auth/me")
            set({ authUser: res.data.user })
        } catch (error) {
            set({ authUser: null })
        } finally {
            set({ checkingAuth: false })
        }
    },

    registerUser: async (data) => {
        try {
            set({ loading: true })
            const res = await axiosInstance.post("/auth/register", data)
            set({ authUser: res.data.link })
        } catch (error) {
            set({ authUser: null })
        } finally {
            set({ loading: false })
        }
    },
    loginUser: async (loginData) => {
        try {
            // Validate input
            await loginSchema.validate(loginData, { abortEarly: false });

            set({ loading: true });
            // const res = await axiosInstance.post("/auth/login", loginData);
            // set({ authUser: res.data.link });

        } catch (error) {
            if (error.name === "ValidationError") {
                // Handle validation errors
                console.error("Validation errors:", error.errors);
                return { validationErrors: error.errors }; // Return validation errors
            }
            set({ authUser: null });
        } finally {
            set({ loading: false });
        }
    }
}))