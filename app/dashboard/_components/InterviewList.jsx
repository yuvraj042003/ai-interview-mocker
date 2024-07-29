"use client"

import { MockInterview } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react';
import db from '@/utils/db';  // Ensure this import is correct based on your project structure
import { eq, desc } from 'drizzle-orm'; 
import InterviewItemCard from './interviewItemCard';  // Capitalized and fixed the import
import { Button } from '@/components/ui/button';

function InterviewList() {
    const { user } = useUser();
    const [interviewList, setInterviewList] = useState([]);

    useEffect(() => {
        if (user) {
            getInterviewList();
        }
    }, [user]);

    const getInterviewList = async () => {
        try {
            const result = await db.select()
                .from(MockInterview)
                .where(eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress))
                .orderBy(desc(MockInterview.id));

            console.log(result);
            setInterviewList(result);
        } catch (error) {
            console.error("Error fetching interview list:", error);
        }
    }

    return (
        <div>
            <h2 className='font-medium text-xl'>Previous Mock Interviews</h2>
            <div className='grid grid-cols-1 md:gird-cols-2 lf:grid-cols-3 gap-5 my-3'>
                {interviewList && interviewList.map((interview, index) => (
                    <InterviewItemCard key={index} interview={interview} />
                ))}
            </div>
        </div>
    )
}

export default InterviewList;
