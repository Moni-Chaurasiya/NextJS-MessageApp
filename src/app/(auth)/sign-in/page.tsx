"use client"
import React from 'react'

import { zodResolver } from "@hookform/resolvers/zod"
import { signInSchema } from '@/src/schemas/signInSchema'
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

import Link from 'next/link'

import { useToast } from "@/hooks/use-toast"
import { useRouter } from 'next/navigation'

import { signIn } from 'next-auth/react'

export default function SignInForm() {
   
   
 
    const { toast } = useToast()
    const router = useRouter()

    //zod implementation

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: '',
            password: ''
        }
    })
 

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
     const result=  await signIn('credentials',{
        redirect:false,
        identifier: data.identifier,
        password:data.password
       })
       if(result?.error){
        if(result.error==='CredentialsSignin'){
            toast({
                title:"Login Failed",
                description:"Incorrect username or password",
                variant:"destructive"
            })

        }else{
            toast({
                title:"Error",
                description:result.error,
                variant:"destructive"
            })
        }
       }

       if(result?.url){
        router.replace('/dashboard')
       }
    }

    return (

    <div className="flex justify-center items-center min-h-screen bg-gray-800">
    <div className=" max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md mt-20">
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
                    name="identifier"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email/User</FormLabel>
                            <FormControl>
                                <Input placeholder="email/username" {...field} />
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
                <Button type="submit" className='flex align-middle justify-center'>
                    signIn
                </Button>
            </form>
        </Form>
        <div className="text-center mt-4">
            <p>
                Do not have an account?{' '}
                <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
                    Sign up
                </Link>
            </p>
        </div>
    </div>
</div>
    )
}
