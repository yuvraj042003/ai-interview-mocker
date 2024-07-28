import React from 'react';
import Image from 'next/image';
import { UserButton } from '@clerk/nextjs';

function Header() {
  const path = '/dashboard'; 

  return (
    <div className='flex p-4 items-center justify-between bg-secondary shadow-sm'>
      <Image src='/logo.svg' width={160} height={100} alt='logo' />
      <ul className=' hidden md:flex gap-6'>
        <li className={`hover:text-primary hover:font-bold transition-none cursor-pointer ${path == '/dashboard' && 'text-primary font-bold'}`}>
          Dashboard
        </li>
        <li className={`hover:text-primary hover:font-bold transition-none cursor-pointer ${path == '/dashboard/Questions' && 'text-primary font-bold'}`}>Questions</li>
        <li className={`hover:text-primary hover:font-bold transition-none cursor-pointer ${path == '/dashboard/Upgrade' && 'text-primary font-bold'}`}>Upgrade</li>
        <li className={`hover:text-primary hover:font-bold transition-none cursor-pointer ${path == '/dashboard/Works' && 'text-primary font-bold'}`}>How it works?</li>
      </ul>
      <UserButton />
    </div>
  );
}

export default Header;
