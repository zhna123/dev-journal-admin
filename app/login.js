'use client'

import { ErrorMessage } from "@hookform/error-message"
import { useForm } from "react-hook-form"
import { useRouter } from 'next/navigation'

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export default function LogIn() {

  const router = useRouter()

  const { register, handleSubmit, reset, formState: {errors} } = useForm({
    defaultValues: {
      username: '',
      password: ''
    }
  })

  const onSubmit = async(data) => {
    try {
      const res = await fetch(`${SERVER_URL}/auth/login`, {
        method: "POST",
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify(data),
        headers: { 
          'Content-Type': 'application/json',
        }
      })
      if (res.status === 401) {
        console.log("login failed.")
        reset()
      }
      if (res.ok) {        
        router.push('/dashboard')
      }
    } catch (e) {
      console.log("error when log in:" + e)
    }
  }

  const LogInForm = () => {
    return (
      <div className="flex flex-col items-center min-h-screen">
        <p className="text-xl font-medium p-12">Admin Log In</p>
        <form method="post" action="" onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          <label htmlFor="username" className="mb-2">Username</label>
          <input type="text" id="username" 
                {...register("username", {
                  required: "This is required"
                })}
                autoComplete="username" className="mb-4 form-input border-none"/>
          <ErrorMessage
            errors = {errors}
            name="username"
            render={({ message }) => <p className="text-red-600">{message}</p>}
          />
  
          <label htmlFor="password" className="mb-2">Password</label>
          <input type="password" id="password" name="password" 
              {...register("password", {
                required: "This is required"
              })}
              autoComplete="current-password" className="mb-6 form-input border-none"/>
          <ErrorMessage
            errors = {errors}
            name="password"
            render={({ message }) => <p className="text-red-600">{message}</p>}
          />
          <input type="submit" value="Log In" className="form-input border-none mt-4 bg-teal-500" />
        </form>
      </div>
    )
  }

  return (
      <LogInForm />
  )
}
