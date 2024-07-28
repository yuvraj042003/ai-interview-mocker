"use client"
import db from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import React, { useEffect, useState } from 'react'
import { eq } from 'drizzle-orm'
import Webcam from 'react-webcam'
import { Lightbulb, WebcamIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const Interview = ({ params }) => {
    const [interviewData, setInterviewData] = useState();
    const [webcamEnabled, setWebcamEnabled] = useState(false);

    useEffect(() => {
        if (params && params.interviewId) {
            console.log(params.interviewId)
            GetInterviewDetails();
        } else {
            console.error("params or params.interviewId is undefined");
        }
    }, [params])

    // Used to get Interview by using Interview Id
    const GetInterviewDetails = async () => {
        if (!params || !params.interviewId) {
            console.error("Invalid interviewId");
            return;
        }
        
        try {
            const result = await db.select().from(MockInterview)
                .where(eq(MockInterview.mockId, params.interviewId))
            setInterviewData(result[0]);
        } catch (error) {
            console.error("Error fetching interview details:", error);
        }
    }

    return (
        <div className='my-10'>
            <h2 className='font-bold text-2xl'>Let's Get Started</h2>
            <div className='flex flex-col md:flex-row gap-10'>
                <div className='flex flex-col gap-5 w-full md:w-1/2 lg:w-1/3'>
                    {interviewData && (
                        <div className='flex flex-col my-7 gap-5 rounded-lg border p-3'>
                            <h2 className='text-lg'><strong>Job Role/ Job Position:</strong> {interviewData.jobPosition}</h2>
                            <h2 className='text-lg'><strong>Job Description/ Tech-Stack :</strong> {interviewData.jobDesc}</h2>
                            <h2 className='text-lg'><strong>Years of Experience:</strong> {interviewData.jobExperience}</h2>
                        </div>
                    )}
                    <div className='my-7 p-5 border rounded-lg border-yellow-300 bg-yellow-100'>
                        <h2 className='flex gap-2 items-center text-yellow-500'><Lightbulb/> <strong>Information</strong></h2>
                        <h2 className='mt-3 text-yellow-500'>{process.env.NEXT_PUBLIC_MESSAGE}</h2>
                    </div>
                </div>
                <div className='w-full md:w-1/4 items-end my-5 md:ml-10'> {/* Added md:ml-10 to add space between divs */}
                    {
                        webcamEnabled ? (
                            <Webcam 
                                onUserMedia={() => setWebcamEnabled(true)}
                                onUserMediaError={() => setWebcamEnabled(false)}
                                mirrored={true}
                                style={{
                                    width: '100%',
                                    height: 'auto'
                                }}
                            />
                        ) : (
                            <>
                                <WebcamIcon className='h-72 my-7 w-full p-20 bg-secondary rounded-lg border' />
                                <Button variant="ghost" className='w-full' onClick={() => setWebcamEnabled(true)}>Enable Web Cam and Microphone</Button>
                            </>
                        )
                    }
                </div>
            </div>
            <div className='flex justify-end items-end'>
                <Link href={'/dashboard/interview/'+params.interviewId+'/start'}>
                     <Button varient="primary">Start Interview</Button>
                </Link>
            </div>
        </div>
    )
}

export default Interview
