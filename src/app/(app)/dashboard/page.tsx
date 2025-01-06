'use client'
import React,{useState,useCallback,useEffect} from 'react'
import { useToast } from '@/hooks/use-toast'
import { Message } from '@/src/model/User'
import { useSession } from 'next-auth/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { acceptMessageSchema } from '@/src/schemas/acceptMessageSchema'
import axios,{AxiosError} from 'axios'
import { ApiResponse } from '@/src/types/ApiResponse'
import { User } from 'next-auth'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Loader2, RefreshCcw } from 'lucide-react'
import MessageCard from '@/components/MessageCard'
function page() {
  const [messages,setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] =useState(false)
  const [isSwitchLoading,setIsSwitchLoading] =useState(false)
  const {toast}= useToast()

  const handleDeleteMessage= (messageId:string)=>{
    setMessages(messages.filter((message)=>message._id !== messageId))
  }

  const {data:session}=useSession();
  const form = useForm({
    resolver:zodResolver(acceptMessageSchema),
    defaultValues: { acceptMessages: false }
  })

  const {register,watch,setValue}=form;
  const acceptMessages = watch('acceptMessages')


  // const fetchAcceptMessage=useCallback(async()=>{
  //   setIsSwitchLoading(true)
  //   try {
  //    const response= await axios.get<ApiResponse>('/api/accept-message')
  //    setValue('acceptMessages',response.data.isAcceptingMessage)
  //   } catch (error) {
  //     const axiosError=error as AxiosError<ApiResponse>
  //     toast({
  //       title:"Error",
  //       description:axiosError.response?.data.message ?? "Failed to fetch message settings",
  //       variant:"destructive"
  //     })
  //   }finally{
  //     setIsSwitchLoading(false)
  //   }
  // },[setValue,toast])
  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
        const response = await axios.get<ApiResponse>('/api/accept-message');
        if (response.data.success  && response.data.isAcceptingMessage !== undefined) {
            setValue('acceptMessages', response.data.isAcceptingMessage);
        } else {
            toast({
                title: "Error",
                description: response.data.message || "Failed to fetch message settings",
                variant: "destructive"
            });
        }
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
            title: "Error",
            description: axiosError.response?.data.message ?? "Failed to fetch message settings",
            variant: "destructive"
        });
    } finally {
        setIsSwitchLoading(false);
    }
}, [setValue, toast]);


  const fetchMessages=useCallback(async(refresh:boolean=false)=>{
     setIsLoading(true)
     setIsSwitchLoading(false)
     try {
      const response= await axios.get<ApiResponse>('/api/get-messages')
      setMessages(response.data.messages || [])
      if(refresh){
        toast({
          title:"Refreshed Messages",
          description:"Showing latest messages",
        })
      }
     } catch (error) {
      const axiosError=error as AxiosError<ApiResponse>
      toast({
        title:"Error",
        description:axiosError.response?.data.message ?? "Failed to fetch message ",
        variant:"destructive"
      })
     }finally{
      setIsLoading(false)
      setIsSwitchLoading(false)
     }
  },[setIsLoading,setMessages,toast])

  useEffect(()=>{
    if(!session || !session.user) return
    fetchMessages()
    fetchAcceptMessage()

  },[session,setValue,fetchAcceptMessage,fetchMessages,toast])

  const handleSwitchChange = async () => {
    try {
        const response = await axios.post<ApiResponse>('/api/accept-message', {
            acceptMessages: !acceptMessages, 
        });
        if(response.data.success){
          setValue('acceptMessages', !acceptMessages); 
            toast({
                title: response.data.message,
                
            });
        }else{
             toast({
                title:"Error",
                description: response.data.message ?? "Failed to update message settings",
                variant:"destructive"
            })
        }

    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
            title: "Error",
            description: axiosError.response?.data.message ?? "Failed to update message settings",
            variant: "destructive"
        });
    }
};

  if(!session || !session.user){
    return <div>Please Login</div>
  }
 
  const {username}=session?.user as User
  const baseUrl = `${window.location.protocol}//${window.location.host}`
  const profileUrl = `${baseUrl}/u/${username}`
  const copyToClipboard=()=>{
    navigator.clipboard.writeText(profileUrl)
    toast({
      title:"Url copied ",
      description: "Profile url copied to clipboard",
    
    })
  }
  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, _index) => (
            <MessageCard
              key={message.id}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
}

export default page