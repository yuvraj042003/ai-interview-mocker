"use client";
import { UserAnswer } from '@/utils/schema';
import React, { useEffect, useState } from 'react';
import db from '@/utils/db';
import { eq } from 'drizzle-orm';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@radix-ui/react-collapsible';
import { ChevronsUpDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

function Feedback({ params }) {
  const [feedbackList, setFeedbackList] = useState([]);
    const router = useRouter();
  useEffect(() => {
    GetFeedback();
  }, []);

  const GetFeedback = async () => {
    const result = await db.select()
      .from(UserAnswer)
      .where(eq(UserAnswer.mockIdRef, params.interviewId))
      .orderBy(UserAnswer.id);

    console.log(result);
    setFeedbackList(result);
  };

  return (
    <div className='p-10'>
        {feedbackList?.length==0? <h2 className='font-bold text-gray-500 ' >No interview record found.</h2>:<>
        
      <h2 className='text-4xl font-bold text-green-500'>Congratulations! ✨🎉</h2>
      <h2 className='font-bold text-2xl'>Here is your Interview Feedback.</h2>
      <h2 className='text-primary text-lg my-3'>Your overall interview rating: <strong>7/10</strong></h2>
      <h2 className='text-sm text-gray-500'>Find below interview questions with correct answers, your answers, and feedback for improvement.</h2>
      {
        feedbackList && feedbackList.map((item, index) => (
          <Collapsible className='mt-10'key={index}>
            <CollapsibleTrigger className='w-full cursor-pointer bg-secondary p-2 rounded-lg justify-between text-left my-2 gap-5'>{item.question} <ChevronsUpDown className='h-4 w-5' /></CollapsibleTrigger>
            <CollapsibleContent >
            <div className='flex flex-col gap-2'>
              <h2 className='text-red-500 p-2 border rounded-lg'><strong>Rating:</strong> {item.rating}</h2>
              <h2 className='p-2 border rounded-lg bg-red-50 text-sm text-red-900'><strong>User Answer:</strong> {item.userAns}</h2>
              <h2 className='p-2 border rounded-lg bg-green-50 text-sm text-green-900'><strong>Correct Answer:</strong> {item.correctAns}</h2>
              <h2 className='p-2 border rounded-lg bg-blue-50 text-sm text-primary'><strong>Feedback:</strong> {item.feedback}</h2>
          </div>
            </CollapsibleContent>
          </Collapsible>
        ))
      }
      <Button onClick={()=>router.replace('/dashboard')}>Go Home</Button>
        </>}
    </div>
  );
}

export default Feedback;
