'use client'
import { ErrorMessage } from "@hookform/error-message"
import { useForm } from "react-hook-form"
import { useRouter } from 'next/navigation'
import PostEditor from "./post-editor";
import { useCallback, useEffect, useRef, useState } from "react";
import { debounce } from "lodash"
import { saveData } from "@/lib/db";

export default function UpdatePost({postTitle, postContent, postId}) {

  const router = useRouter()

  const { register, handleSubmit, control, watch, setValue, reset, formState: {errors} } = useForm({
    defaultValues: {
      title: '',
      content: ''
    }
  })

  // set initial value
  useEffect(() => {
    setValue('title', postTitle)
    setValue('content', postContent)
  }, []) 

  // watch data change for auto save
  const data = watch()
  const cleanupFlag = useRef(false)
  // make sure only one debouncedSave created to ensure correct debounce
  const debouncedSave = useCallback( 
    debounce(async (data) => {
      if(postId !== null && !cleanupFlag.current) {
        const doc = await saveData(data, `http://localhost:3000/posts/${postId}`, 'PUT')
        if (doc === null) {
          router.replace('/')
        }
      }
    }, 1000), 
    []
  )

  useEffect(() => {
    if (data.title !== '' || data.content !== '') {
      debouncedSave(data)
    } 
  }, [data, debouncedSave])

  // clean up only happens when component unmounts thus I supplied empty dependency array
  useEffect(() => {
    return () => {
      cleanupFlag.current = true;
      // the cancel didn't work, so I used a cleanupFlag instead
      // debouncedSave.cancel()
    }
  }, [])

  const handleDraftSave = () => {

    const save = async(data) => {
      const doc = await saveData(data, `http://localhost:3000/posts/${postId}`, 'PUT')
      if (doc === null) {
        router.replace('/')
      } else {
        router.push('/dashboard')
      }
    };

    handleSubmit(save)()
  }

  const handlePostPublish = () => {

    const save = async(data) => {
      const doc = await saveData(data, `http://localhost:3000/posts/${postId}`, 'PUT', true)
      if (doc === null) {
        router.replace('/')
      } else {
        router.push('/dashboard')
      }
    };

    handleSubmit(save)()
  }

  return (
    <div className="p-12">
      <p className="text-xl font-medium mb-6">Edit Post</p>
      <form className="flex flex-col gap-2">
        <label htmlFor="title"> Title </label>
        <input type="text" id="title"
          {...register("title", {
            required: "This is required"
          })}
          className="form-input border-none mb-4" 
          />
        <ErrorMessage
          errors = {errors}
          name="title"
          render={({ message }) => <p className="text-red-600">{message}</p>}
        />
        <label htmlFor="title"> Content </label>
        <PostEditor control={control} name="content" errors={errors} />
      </form>
      <div className="flex justify-end gap-4 mt-4">
          <input type="button" name="submit-btn" value="Save Draft" 
            onClick={ handleDraftSave } 
            className="form-input w-24 border-none mt-4 bg-teal-500 p-2 hover:bg-teal-600 active:bg-teal-700 cursor-pointer" />
            
          <input type="button" name="submit-btn" value="Publish" 
            onClick={ handlePostPublish } 
            className="form-input w-24 border-none mt-4 bg-teal-500 p-2 hover:bg-teal-600 active:bg-teal-700 cursor-pointer" />
      </div>
    </div>
    
  )
}