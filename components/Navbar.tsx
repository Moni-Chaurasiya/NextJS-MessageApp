'use client';
import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/button';

function Navbar() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a href="#" className="text-2xl font-bold mb-4 md:mb-0">Mystry Message</a>
        <div className=''>
        <a href="/" className="text-xl hover:text-yellow-300 mx-5 mb-4 md:mb-0">Home Page</a>
        <a href="/dashboard" className="text-xl hover:text-yellow-300  mx-5 mb-4 md:mb-0">Dashboard</a>

        </div>
        <br className="md:hidden" />
        {session ? (
          <div className="flex items-center">
            <span className="mr-4">Welcome, {user?.username || user?.email}</span>
            <Button
              onClick={() => signOut()}
              className="w-full md:w-auto bg-slate-100 text-black"
              variant="outline"
            >
              Logout
            </Button>
          </div>
        ) : (
          <Link href="/sign-in">
            <Button className="w-full md:w-auto bg-slate-100 text-black" variant="outline">
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
