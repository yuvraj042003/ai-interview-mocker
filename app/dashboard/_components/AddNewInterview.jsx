"use client";
// _components/AddNewInterview.js
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { chatSession } from '@/utils/GeminiAIModel';
import { LoaderCircle } from 'lucide-react';
import db from '@/utils/db';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
import { MockInterview } from '@/utils/schema';
import { useRouter } from 'next/navigation';

const AddNewInterview = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [jobExperience, setJobExperience] = useState('');
  const [loading, setLoading] = useState(false);
  const [jsonResponse, setJsonResponse] = useState([]);
  const { user } = useUser();
  const Router = useRouter();

  const onSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    console.log(jobPosition, jobDesc, jobExperience);

    const inputPrompt = `Job Position: ${jobPosition}, Job Description: ${jobDesc}, Years of Experience: ${jobExperience}. Depending on this information please give me ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} interview questions with answers in JSON format. Include 'Question' and 'Answer' as fields in the JSON.`;

    try {
      const result = await chatSession.sendMessage(inputPrompt);
      const mockJsonResp = (await result.response.text()).replace('```json', '').replace('```', '');
      
      console.log(JSON.parse(mockJsonResp));
      setJsonResponse(mockJsonResp);

      if (mockJsonResp) {
        const resp = await db.insert(MockInterview).values({
          mockId: uuidv4(),
          jsonMockResp: mockJsonResp,
          jobPosition,
          jobDesc,
          jobExperience,
          createdBy: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format('DD-MM-YYYY'),
        }).returning({ mockId: MockInterview.mockId });

        console.log("Inserted ID:", resp);
        if(resp){
          setOpenDialog(false)
          ReceiptPoundSterling.push('/dashboard/interview'+resp[0]?.mockId)
        }
        if (resp && resp.length > 0) {
          console.log("Mock Interview ID:", resp[0].mockId);
        } else {
          console.log("Error: Insert operation did not return expected response.");
        }
      } else {
        console.log("Error in JSON Response");
      }
    } catch (error) {
      console.error('Error generating interview questions:', error);
    }
    setLoading(false);
  };

  return (
    <div>
      <div
        className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all'
        onClick={() => setOpenDialog(true)}
      >
        <h2 className='text-lg text-center'>+ Add New</h2>
      </div>
      <Dialog open={openDialog}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>Tell us more about your job</DialogTitle>
            <DialogDescription>
              <form onSubmit={onSubmit}>
                <h2>Add details about your job position/role, job description, and years of experience.</h2>
                <div className='mt-7 my-3'>
                  <label>Job Role/Job Position</label>
                  <Input
                    placeholder='Ex. Full Stack Developer'
                    required
                    onChange={(event) => setJobPosition(event.target.value)}
                  />
                </div>
                <div className='my-3'>
                  <label>Job Description/Tech Stack (In Short)</label>
                  <Textarea
                    placeholder='Ex. React, Angular, Vite, Next.js etc'
                    required
                    onChange={(event) => setJobDesc(event.target.value)}
                  />
                </div>
                <div className='my-3'>
                  <label>Years of Experience</label>
                  <Input
                    placeholder='Eg. 1'
                    type='number'
                    max='100'
                    min='0'
                    required
                    onChange={(event) => setJobExperience(event.target.value)}
                  />
                </div>
                <div className='flex gap-5 justify-end'>
                  <Button type="button" variant="ghost" onClick={() => setOpenDialog(false)}>Cancel</Button>
                  <Button type='submit' disabled={loading}>
                    {loading ?
                      <>
                        <LoaderCircle className='animate-spin' /> 'Generating from AI'
                      </> : 'Start Interview'
                    }
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddNewInterview;
