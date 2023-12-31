import Image from 'next/image'
import {Button} from "@/components/ui/button"
import { UserButton, auth} from '@clerk/nextjs'
import Link from 'next/link';
import { LogIn } from 'lucide-react'
import FileUpload from '@/components/FileUpload'
export default async function Home() {
  //auth is function from ClerkAuth
  const { userId } = await auth();// this will return the user id of the current user if he will be signed in ->ans type is String
  //other wise it is empty
  
  if (true) {
  console.log("User ID:", userId);
} else {
  console.log("User is not authenticated");
}
  
  const isAuth = !!userId;

  return(
    <div className='w-screen min-h-screen bg-gradient-to-r from-rose-100 to-teal-100'>
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
        <div className='flex flex-col items-center text-center'> 
          <div className='flex items-center'>
            <h1 className='mr-3 text-5xl font-semibold'>Chat With any PDF</h1>
            <UserButton afterSignOutUrl='/'></UserButton>  {/*//user profile button */}
          </div>
          <div className='flex mt-2'>
            {isAuth && <Button>Go to Chats</Button>}
          </div>
          <p className='max-w-xl mt-1 text-lg text-slate-600'>Join millions of students, researchers and professionals to instantly answer questions and understand research with AI</p>
          <div className='w-full mt-4'>
            {isAuth ? (
              <FileUpload></FileUpload>
            ) : (
              <Link href="/sign-in">
                <Button>Login to get Started
                  <LogIn className='w-4 h-4 ml-2'></LogIn>
                </Button>
              </Link>
              
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
