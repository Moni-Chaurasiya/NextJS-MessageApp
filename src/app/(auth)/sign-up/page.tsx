"use client"

import React, { useEffect } from 'react'
import { useDebounceCallback } from 'usehooks-ts'
import { zodResolver } from "@hookform/resolvers/zod"
import { signUpSchema } from '@/src/schemas/signUpSchema'
import { useForm } from "react-hook-form"
import { Form,
         FormField, 
         FormControl, 
         FormItem,
         FormLabel,
         FormMessage
       } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import * as z from "zod"
import { Loader2 } from 'lucide-react';
import Link from 'next/link'
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from 'next/navigation'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/src/types/ApiResponse'

export default function SignUpForm() {
    const [username, setUsername] = useState('')
    const [usernameMessage, setUsernameMessage] = useState('')
    const [isCheckingUsername, setIsCheckingUsername] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const debounced = useDebounceCallback(setUsername, 500)
    const { toast } = useToast()
    const router = useRouter()

    //zod implementation

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            email: '',
            password: ''
        }
    })
    useEffect(() => {
        const checkUsernameUnique = async () => {
            if (username) {
                setIsCheckingUsername(true)
                setUsernameMessage('')
                try {
                    const response = await axios.get(`/api/Check-Username-Unique?username=${username}`)
                    
                    let message=response.data.message
                    setUsernameMessage(message)
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>;
                    setUsernameMessage(axiosError.response?.data.message ?? "Error checking username")
                } finally {
                    setIsCheckingUsername(false)
                }
            }
        }
        checkUsernameUnique();
    }, [username]);

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true)
        try {
            const response = await axios.post<ApiResponse>('/api/sign-up', data)
            toast({
                title: 'Success',
                description: response.data.message
            })
            router.replace(`/verify/${username}`)
            setIsSubmitting(false)
        } catch (error) {
            console.error("Error in signup of user", error)
            const axiosError = error as AxiosError<ApiResponse>;
            let errorMessage = axiosError.response?.data.message
            toast({
                title: "Signup failed",
                description: errorMessage,
                variant: "destructive"
            })
            setIsSubmitting(false)
        }
    }

    return (

        // <div className="flex justify-center items-center min-h-screen bg-gray-800">
        //     <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        //         <div className="text-center">
        //             <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
        //                 Join True Feedback
        //             </h1>
        //             <p className="mb-4">Sign up to start your anonymous adventure</p>
        //         </div>

        //         <Form {...form}>
        //             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        //                 <FormField
        //                     control={form.control}
        //                     name="username"
        //                     render={({ field }) => (
        //                         <FormItem>
        //                             <FormLabel>Username</FormLabel>
                                    
        //                                 <Input placeholder="username"
        //                                     {...field}
        //                                     onChange={(e) => {
        //                                         field.onChange(e)
        //                                         debounced(e.target.value)
        //                                     }}
        //                                 />

                            
        //                             {isCheckingUsername && <Loader2 className="animate-spin" />}
        //                             <p className={`text-sm ${usernameMessage=== "Username is unique" ? 'text-green-500':'text-red-500'}`}></p>

        //                             <FormMessage />
        //                         </FormItem>
        //                     )}
        //                 />
        //                 <FormField
        //                     control={form.control}
        //                     name="email"
        //                     render={({ field }) => (
        //                         <FormItem>
        //                             <FormLabel>Email</FormLabel>
        //                             <FormControl>
        //                                 <Input placeholder="email"
        //                                     {...field}

        //                                 />
        //                             </FormControl>

        //                             <FormMessage />
        //                         </FormItem>
        //                     )}
        //                 />
        //                 <FormField
        //                     control={form.control}
        //                     name="password"
        //                     render={({ field }) => (
        //                         <FormItem>
        //                             <FormLabel>Password</FormLabel>
        //                             <FormControl>
        //                                 <Input type="password" placeholder="password"
        //                                     {...field}

        //                                 />
        //                             </FormControl>

        //                             <FormMessage />
        //                         </FormItem>
        //                     )}
        //                 />
        //                 <Button type="submit" disabled={isSubmitting} >
        //                     {
        //                         isSubmitting ? (
        //                             <>
        //                                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        //                                 Please Wait
        //                             </>
        //                         ) : ('Signup')
        //                     }


        //                 </Button>
        //             </form>

        //         </Form>
        //         <div className="text-center mt-4">
        //             <p>
        //                 Already a member?{' '}
        //                 <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
        //                     Sign in
        //                 </Link>
        //             </p>
        //         </div>
        //     </div>

        // </div>
    <div className="flex justify-center items-center min-h-screen bg-gray-800 mt-10">
    <div className=" max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                Join True Feedback
            </h1>
            <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <Input
                                placeholder="username"
                                {...field}
                                onChange={(e) => {
                                    field.onChange(e);
                                    debounced(e.target.value);
                                }}
                            />
                            {isCheckingUsername && <Loader2 className="animate-spin" />}
                            <p className={`text-sm ${usernameMessage === "Username is unique" ? 'text-green-500' : 'text-red-500'}`}>
                                {usernameMessage}
                            </p>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Please Wait
                        </>
                    ) : (
                        'Signup'
                    )}
                </Button>
            </form>
        </Form>
        <div className="text-center mt-4">
            <p>
                Already a member?{' '}
                <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
                    Sign in
                </Link>
            </p>
        </div>
    </div>
</div>


    )
}



