"use client";
import React, { useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import useSpeechToText from 'react-hook-speech-to-text';
import { Mic, StopCircle } from 'lucide-react';
import { toast } from 'sonner';
import { chatSession } from '@/utils/GeminiAIModel';
import db from '@/utils/db';
import { UserAnswer } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';

function RecordAnswerSection({ mockInterviewQuestion, interviewData, activeQuestionIndex, setActiveQuestionIndex }) {
  const [userAnswer, setUserAnswer] = useState('');
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const {
    error,
    interimResult,
    isRecording,
    results,
    setResults,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  useEffect(() => {
    if (results.length > 0) {
      setUserAnswer(results.map(result => result.transcript).join(' '));
    }
  }, [results]);

  useEffect(() => {
    if (!isRecording && userAnswer.length >= 10) {
      UpdateUserAnswer();
    }
  }, [isRecording]);

  const StartStopRecording = async () => {
    if (isRecording) {
      stopSpeechToText();
    } else {
      startSpeechToText();
    }
  };

  const UpdateUserAnswer = async () => {
    setLoading(true);
    const feedbackPrompt = `Question: ${mockInterviewQuestion[activeQuestionIndex].Question}, User Answer: ${userAnswer}. Please give us the rating for answer and feedback as area of improvement if any in just 3 to 5 lines to improve it in JSON format with rating field and feedback field.`;

    try {
      const result = await chatSession.sendMessage(feedbackPrompt);
      const mockJsonResp = (await result.response.text()).replace('```json', '').replace('```', '');
      const JsonFeedbackResp = JSON.parse(mockJsonResp);

     const resp =  await db.insert(UserAnswer).values({
        mockIdRef: interviewData?.mockId,
        question: mockInterviewQuestion[activeQuestionIndex].Question,
        correctAns: mockInterviewQuestion[activeQuestionIndex].Answer,
        userAns: userAnswer,
        feedback: JsonFeedbackResp?.feedback,
        rating: JsonFeedbackResp?.rating,
        userEmail: user.primaryEmailAddress?.emailAddress,
        createdAt: moment().format('DD-MM-YYYY'),
      });

      if(resp){
        toast.success('User Answer recorded Successfully');
        setUserAnswer('');
        setResults([]);

      }
      setResults([]);
    } catch (error) {
      toast.error('Error while saving your answer, Please Record again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center'>
      <div className='relative flex flex-col justify-center items-center mt-20 rounded-lg p-5 bg-black' style={{ height: '400px', width: '600px' }}>
        <Image src={'/webcam.png'} width={200} height={200} className='absolute' />
        <Webcam
          mirrored={true}
          style={{
            height: '100%',
            width: '100%',
            zIndex: 10,
            borderRadius: '8px',
          }}
        />
        <div className='absolute bottom-5 flex gap-4' style={{ zIndex: 20 }}>
          <Button 
            variant="outline" 
            onClick={StartStopRecording}
            disabled={loading}
          >
            {isRecording ? (
              <h2 className='text-red-600 animate-pulse flex gap-2'>
                <StopCircle /> Stop Recording
              </h2>
            ) : (
              <div className='flex items-center gap-2'>
                <Mic /> Record Answer
              </div>
            )}
          </Button>
        
        </div>
      </div>
    </div>
  );
}

export default RecordAnswerSection;
