// LoginRegisterBox.js
// import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Input } from "@nextui-org/react";
import axios from "axios";
import "./Login.css";
import { Toaster, toast } from "sonner";
//creating Login Scheme using zod
const LoginScheme = z.object({
  username: z.string().min(4, { message: "Username atleast contain 4 character" }),
  password: z.string().min(4, { message: "Password (string only) atleast contain 4 character" }),
});

const LoginRegister = () => {
  const navigate = useNavigate();
  // const [isLogin, setIsLogin] = useState(true);

  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },

    resolver: zodResolver(LoginScheme),
  });

  const onSubmit = async (data) => {
    try {
      // Send login data to backend
      const response = await axios.post("http://localhost:3000/api/login", data);

      const token = response.data.token;
      localStorage.setItem("token", token);
      // Check if login is successful
      if (response.data.success) {
        // alert("Login successful!");
        toast.success("Login successful!");
      } else {
        alert("Login failed: " + response.data.message);
      }

      navigate("/dashboard");
    } catch (error) {
      console.error("Login error", error);
      alert("An error occurred during login. Please try again.");
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="shadow-xl p-7 rounded-3xl w-96 h-96 flex flex-col items-center justify-evenly">
        <h1>Login To Job Portal </h1>
        <form onSubmit={form.handleSubmit(onSubmit)} className=" h-80 justify-evenly flex flex-col w-full items-center">
          <Controller
            name="username"
            control={form.control}
            render={({ field, fieldState }) => {
              return <Input {...field} variant="bordered" color="primary" type="text" label="Username" className="shadow-2xl  rounded-xl" isInvalid={Boolean(fieldState.error)} errorMessage={fieldState.error?.message} />;
            }}
          />
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => {
              return <Input {...field} variant="bordered" color="primary" type="password" label="Password" className="shadow-2xl  rounded-xl" isInvalid={Boolean(fieldState.error)} errorMessage={fieldState.error?.message} />;
            }}
          />

          <Button type="submit" color="primary" className="w-full">
            Masuk
          </Button>
          <Link to={"/register"} className="font-normal text-sm">
            Try to create your account here! click me😁😘
          </Link>
        </form>
      </div>
    </div>
  );
};

export default LoginRegister;
