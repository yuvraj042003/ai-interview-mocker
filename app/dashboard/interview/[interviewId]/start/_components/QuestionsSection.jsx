import { Lightbulb, Volume2 } from 'lucide-react';
import React from 'react';

const QuestionsSection = ({ mockInterviewQuestion, activeQuestionIndex, setActiveQuestionIndex }) => {
  const questionNote = process.env.NEXT_PUBLIC_QUESTION_NOTE;
    const textToSpeach=(text)=>{
        if('speechSynthesis' in window){
            const speech = new SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(speech)
        }
        else{
            alert('Sorry, Your Browser does not support text to speech.')
        }
    }

  return (
    <div className='p-5 border rounded-lg my-10'>
        {/* List of Questions */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
            {mockInterviewQuestion && mockInterviewQuestion.map((question, index) => (
                <div key={index}>
                    <h2 
                        className={`p-3 text-xs md:text-sm text-center cursor-pointer rounded-full border ${activeQuestionIndex === index ? 'bg-primary text-white' : ''}`}
                        onClick={() => setActiveQuestionIndex(index)}
                    >
                        Question #{index + 1}
                    </h2>  
                </div>
            ))}
        </div>
        
        {/* Active Question Details */}
        {mockInterviewQuestion[activeQuestionIndex] && (
            <div className='my-5'>
                <h2 className='my-5 text-md sm:text-lg'>{mockInterviewQuestion[activeQuestionIndex].Question}</h2>
                <Volume2 className='cursor-pointer' onClick={()=>textToSpeach(mockInterviewQuestion[activeQuestionIndex].Question)} />
            </div>
        )}
        <div className='border rounded-lg p-5 bg-blue-100 mt-20'>
            <h2 className='flex gap-2 items-center text-primary'>
                <Lightbulb/>
                <strong>Note:</strong>
            </h2>
            <h2 className='text-sm text-primary my-2'>{questionNote}</h2>
        </div>
    </div>
  );
}

export default QuestionsSection;
