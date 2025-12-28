import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "../utils/axiosInstance"
import { API_PATHS } from "../utils/apiPaths"
import { BookOpen } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import {
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { randomToast, showError, showSuccess } from "@/components/ui/ToastFunctions";

const formSchema = z.object({
  email: z
    .email("Invalid email format")
    .min(1, "Email is required"),
  password: z.string()
    .min(6, "Password must be at least 6 characters long")
    .max(20, "Password must not exceed 20 characters")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

const LoginPage = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { handleSubmit, control } = form;
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
        const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, data);
        const { token } = response.data;

        const profileResponse = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE, {
            headers: { Authorization: `Bearer ${token}` },
        });

        login(profileResponse.data, token);
        showSuccess("Login Successful");
        navigate("/dashboard");
    } catch (error) {
        localStorage.clear();
        showError(error.response?.data?.message || "Login Failed. Please try again");
    } finally {
        setIsLoading(false);
    }
};

  return (
    <div className="min-h-screen bg-linear-to-br from-cyan-100 via-pink-100 to-violet-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-teal-400 to-cyan-500 rounded-full mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
          <p className="text-slate-600 mt-2">Sign in to continue to your eBook dashboard.</p>
        </div>
        <div className="bg-slate-50 border-slate-400 rounded-xl shadow-lg p-8">
          <FormProvider {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field}  className="border-2 focus:border-teal-100 focus:ring focus:ring-teal-100 focus:outline-none focus:shadow-lg transition duration-300"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter your password" {...field} className="border-2 focus:border-teal-100 focus:ring focus:ring-teal-100 focus:outline-none focus:shadow-lg transition duration-300" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" isLoading={isLoading} className="w-full">Login</Button>
            </form>
          </FormProvider>
          <p className="text-center text-sm text-slate-600 mt-8">
            Dont have an account?{' '}
            <Link to="/signup" className="font-medium text-teal-600 hover:text-teal-700">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;