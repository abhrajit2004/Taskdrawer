"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {

  const [loginState, setLoginState] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const router = useRouter();

  const toggleLoginState = () => {
    setLoginState(!loginState);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const signupUser = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    console.log(data)
    if (res.ok) {
      localStorage.setItem("token", data.token); // Store token
      localStorage.setItem("userId", data.id);
      localStorage.setItem("username", data.username);
      router.push("/dashboard");
    } else {
      console.error(data.error);
    }
  };

  const loginUser = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: formData.email, password: formData.password }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token); // Store token
      localStorage.setItem("userId", data.id); // Store user id
      localStorage.setItem("username", data.username); // Store username
      router.push("/dashboard");
    } else {
      console.error(data.error);
    }

  }

  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.push("/dashboard");
    }
  }, []);


  return (
    <>
      <form className={cn("flex flex-col gap-6", className)} {...props}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">{!loginState ? "Sign up to your account" : "Log in to your account"}</h1>
        </div>
        <div className="grid gap-6">

          {!loginState &&
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input value={formData.name} name="name" onChange={handleInputChange} id="name" type="text" required />
            </div>
          }

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input value={formData.email} name="email" onChange={handleInputChange} id="email" type="email" placeholder="m@example.com" required />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input value={formData.password} name="password" onChange={handleInputChange} id="password" type="password" required />
          </div>

        </div>

      </form>
      {!loginState ?
            <Button onClick={(e: React.MouseEvent<HTMLButtonElement>) => signupUser(e)} type="submit" className="w-full my-6">
              Sign up
            </Button>
            :
            <Button onClick={(e: React.MouseEvent<HTMLButtonElement>) => loginUser(e)} type="submit" className="w-full my-6">
              Login
            </Button>
          }
      <div className="text-center text-sm">
        {!loginState ? "Already have an account?" : "Don't have an account?"}
        <a onClick={toggleLoginState} className="underline underline-offset-4 cursor-pointer mx-2 my-2">
          {!loginState ? "Login" : "Sign up"}

        </a>
      </div>
    </>

  )
}
