'use client' // we have to use this if we are going to use usestate / any component require interactivity on clicking 
import { uploadToS3 } from '@/lib/db/s3';
import { log } from 'console';
import { Inbox } from 'lucide-react';
import React from 'react'
import { useDropzone } from 'react-dropzone';


const FileUpload = () => {
    const{ getRootProps, getInputProps} = useDropzone({
        accept : {"application/pdf" : ['.pdf']},
        maxFiles : 1,
        onDrop : async(acceptedFiles) => {              // acceptedFiles is an array of files that we have dropped - >but it only contain one file as maxLength is 1 
            console.log(acceptedFiles);
            const file = acceptedFiles[0];
            if(file.size > 10 * 1024 * 1024){
                //bigger the 10mb
                alert("Please upload a file less than 10mb");
                return;
            }
            try{
                const data = await uploadToS3(file);
                console.log("data", data);
                
            }
            catch(err){
                console.log(err);
            }
        }
    });
  return (
    <div className='p-2 bg-white rounded xl'>
        <div {...getRootProps({
            className : "border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col",
        })}
        >
            <input  {...getInputProps()} />
            <>
            <Inbox className='w-10 h-10 text-blue-500' />
                <p className='mt-2 text-sm text-slate-400'>Drop your PDF here</p>
            </>
        </div>
    </div>
  )
}
export default FileUpload;