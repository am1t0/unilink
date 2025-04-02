import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import * as yup from "yup";
import toast from "react-hot-toast";

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
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  collageName: yup.string().required("College is required"),
});

export const useAuthStore = create((set) => ({
  authUser: null,
  checkingAuth: true,
  loading: false,

  checkAuth: async () => {
    try {
      set({ checkingAuth: true });
      const res = await axiosInstance.get("/auth/me");
      set({ authUser: res.data.user });
    } catch (error) {
      set({ authUser: null });
    } finally {
      set({ checkingAuth: false });
    }
  },

  registerUser: async (data) => {
    try {
      set({ loading: true });
      // Validate input
      await registerSchema.validate(data, { abortEarly: false });

      // Make API request
      const res = await axiosInstance.post("/auth/register", data);
      set({ authUser: res.data.link });

      return { success: true };
    } catch (error) {
      if (error.name === "ValidationError") {
        // If Yup validation error, return structured error messages
        const validationErrors = error.inner.map((err) => err.message); // Extract all validation error messages
        return { success: false, type: "validation", errors: validationErrors };
      } else if (error.response) {
        // If API error, handle based on backend response
        return {
          success: false,
          type: "api",
          message: error.response.data.message || "An error occurred",
        };
      } else {
        // Other errors (e.g., network issues)
        return {
          success: false,
          type: "other",
          message: "Something went wrong. Please try again.",
        };
      }
    } finally {
      set({ loading: false });
    }
  },
  loginUser: async (loginData) => {
    try {
      set({ loading: true });

      // Validate input
      await loginSchema.validate(loginData, { abortEarly: false });

      // Make API request
      const res = await axiosInstance.post("/auth/login", loginData);
      set({ authUser: res.data.link });

      return { success: true };
    } catch (error) {
      if (error.name === "ValidationError") {
        // If Yup validation error, return structured error messages
        const validationErrors = error.inner.map((err) => err.message); // Extract all validation error messages
        return { success: false, type: "validation", errors: validationErrors };
      } else if (error.response) {
        // If API error, handle based on backend response
        return {
          success: false,
          type: "api",
          message: error.response.data.message || "An error occurred",
        };
      } else {
        // Other errors (e.g., network issues)
        return {
          success: false,
          type: "other",
          message: "Something went wrong. Please try again.",
        };
      }
    } finally {
      set({ loading: false });
    }
  },

  updateProfile: async (data) => {
    console.log("data is ",data);
    try {

      set({ loading: true });

    //validate phone input if given
    const phoneRegex = /^[6-9]\d{9}$/;
    if(data.phone && !phoneRegex.test(data.phone)){
      toast.error("Please enter a valid phone number");
      return;
    }

      // Make API request
      const res = await axiosInstance.put("/auth/profileedit", data);
      set({ authUser: res.data.user });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 413) {
        toast.error("Image size exceeds the upload limit of 100 kB");
      } else {
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    } finally {
      set({ loading: false });
    }
  },

  uploadProfileImage: async (file) => {
    try {
      set({ loading: true });
      const formData = new FormData();
      formData.append("profileImage", file);

      const res = await axiosInstance.post("/auth/upload-profile-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      set((state) => ({
        authUser: { ...state.authUser, avatar: res.data.avatar }
      }));

      toast.success(res.data.message);
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || "Error uploading profile image");
      return { success: false };
    } finally {
      set({ loading: false });
    }
  },

  uploadBannerImage: async (file) => {
    try {
      set({ loading: true });
      const formData = new FormData();
      formData.append("bannerImage", file);

      const res = await axiosInstance.post("/auth/upload-banner-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      set((state) => ({
        authUser: { ...state.authUser, banner: res.data.banner }
      }));

      toast.success(res.data.message);
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || "Error uploading banner image");
      return { success: false };
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    try {
      const res = await axiosInstance.post("/auth/logout");
      if (res.status === 200) set({ authUser: null });
      toast.success("Logout successfully");
    } catch (error) {
      toast.error(error.response.data.message || "something went wrong");
    }
  },
}));
