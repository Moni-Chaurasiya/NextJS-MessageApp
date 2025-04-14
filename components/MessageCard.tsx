"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Message } from "@/src/model/User";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { ApiResponse } from "@/src/types/ApiResponse";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  const { toast } = useToast();
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const handleDeleteConfirm = async () => {
    const response = await axios.delete<ApiResponse>(
      `/api/delete-message/${message._id}`
    );
    toast({ title: response.data.message });
    onMessageDelete(message.id);
  };

  const openImageModal = () => {
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Message</CardTitle>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon">
                  <X className="w-5 h-5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteConfirm}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <CardDescription>{message.content}</CardDescription>
        </CardHeader>

        {message.image && (
          <CardContent>
            <img
              src={message.image}
              alt="Uploaded message image"
              className="rounded w-full object-cover max-h-60 cursor-pointer"
              onClick={openImageModal}
            />
          </CardContent>
        )}
      </Card>

      {/* Image Modal/Popup */}
      {isImageModalOpen && message.image && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-screen w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
            <div className="absolute top-2 right-2 z-10">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-black bg-opacity-30 hover:bg-opacity-50 text-white"
                onClick={closeImageModal}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="p-2 flex items-center justify-center max-h-[90vh]">
              <img
                src={message.image}
                alt="Full size message image"
                className="max-w-full max-h-[85vh] object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MessageCard;
