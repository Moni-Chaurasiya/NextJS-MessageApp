'use client';
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

import { useSession } from 'next-auth/react';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/src/types/ApiResponse';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';


interface ProfileUser {
  username: string;
  isAcceptingMessage: boolean;
}

export default function ProfilePage({ params }: { params: { username: string } }) {
  const { username } = params;
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [message, setMessage] = useState('');
//  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const { toast } = useToast();
/*
  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get<ApiResponse>(`/api/users/${username}`);
        if (response.data.success) {
          setUser(response.data.user as ProfileUser);
        } else {
          toast({
            title: 'Error',
            description: response.data.message || 'Failed to fetch user data data',
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch user data data data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [username, toast]);

  useEffect(() => {
    const fetchSuggestedMessages = async () => {
      try {
        const response = await axios.post<ApiResponse>('/api/suggest-messages');
        if (response.data.success && response.data.messages) {
          const suggestedMessages = response.data.messages.join('||').split('||');
          setSuggestedMessages(suggestedMessages);
        } else {
          toast({
            title: 'Error',
            description: response.data.message || 'Failed to fetch suggested messages',
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Error fetching suggested messages:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch suggested messages messages',
          variant: 'destructive',
        });
      }
    };

    fetchSuggestedMessages();
  }, [toast]);
*/
useEffect(() => {
  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<ApiResponse>(`/api/users/${username}`);
      if (response.data.success) {
        setUser(response.data.user as ProfileUser);
      } else {
        toast({
          title: 'Error',
          description: response.data.message || 'Failed to fetch user data',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      if (axios.isAxiosError(error)) {
        toast({
          title: 'Error',
          description: error.response?.data.error || 'Failed to fetch user data data',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch user data data data',
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  fetchUser();
}, [username, toast]);

// useEffect(() => {
//   const fetchSuggestedMessages = async () => {
//     try {
//       const response = await axios.post<ApiResponse>('/api/suggest-messages');
//       if (response.data.success) {
//         const suggestedMessages = response.data;
//         setSuggestedMessages(suggestedMessages);
//       } else {
//         toast({
//           title: 'Error',
//           description: response.data.error || 'Failed to fetch suggested messages',
//           variant: 'destructive',
//         });
//       }
//     } catch (error) {
//       console.error('Error fetching suggested messages:', error);
//       if (axios.isAxiosError(error)) {
//         toast({
//           title: 'Error',
//           description: error.response?.data.error || 'Failed to fetch suggested messages',
//           variant: 'destructive',
//         });
//       } else {
//         toast({
//           title: 'Error',
//           description: 'Failed to fetch suggested messages',
//           variant: 'destructive',
//         });
//       }
//     }
//   };

//   fetchSuggestedMessages();
// }, [toast]);

// useEffect(() => {
//   const fetchSuggestedMessages = async () => {
//     try {
//       const response = await axios.post<string[]>('/api/suggest-messages');
//       if (response.status === 200) {
//         setSuggestedMessages(response.data);
//       } else {
//         toast({
//           title: 'Error',
//           description: 'Failed to fetch suggested messages',
//           variant: 'destructive',
//         });
//       }
//     } catch (error) {
//       console.error('Error fetching suggested messages:', error);
//       if (axios.isAxiosError(error)) {
//         toast({
//           title: 'Error',
//           description: error.response?.data.error || 'Failed to fetch suggested messages',
//           variant: 'destructive',
//         });
//       } else {
//         toast({
//           title: 'Error',
//           description: 'Failed to fetch suggested messages',
//           variant: 'destructive',
//         });
//       }
//     }
//   };

//   fetchSuggestedMessages();
// }, [toast]);

  const handleSendMessage = async () => {
    if (!session?.user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to send a message',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        username,
        content: message,
      });
      if (response.data.success) {
        toast({
          title: 'Success',
          description: response.data.message || 'Message sent successfully',
        });
        setMessage('');
      } else {
        toast({
          title: 'Error',
          description: response.data.message || 'Failed to send message',
          variant: 'destructive',
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message ?? 'Failed to send message',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Profile Page of {user.username}</h1>
      {user.isAcceptingMessage ? (
        <div>
          <textarea
            className="w-full h-32 p-2 mb-4 border border-gray-300 rounded"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message..."
          />
          <Button onClick={handleSendMessage}>Send Message</Button>
          <Separator className="my-8" />
          <div>
            <h3 className="text-xl font-semibold mb-4">Suggested Messages:</h3>
  {/*          <ul className="space-y-2">
              {suggestedMessages.map((suggestion, index) => (
                <li
                  key={index}
                  className="cursor-pointer hover:underline"
                  onClick={() => setMessage(suggestion)}
                >
                  {suggestion}
                </li>
              ))}
            </ul>*/}
          </div>
        </div>
      ) : (
        <div>This user is not accepting messages.</div>
      )}
    </div>
  );
}