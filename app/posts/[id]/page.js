'use client'

import Date from "@/components/date"
import { use, cache, useState } from 'react'
import parse from 'html-react-parser'
import {decode} from 'html-entities';
import { useRouter } from 'next/navigation';
import UpdatePost from "@/app/dashboard/new-post/update"

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

// This is a hack(use 'use client') in order to use credentials: 'include'
// I cannot use header() function in generateStaticParams.
// header() function makes page do dynamic render, but
// this could be a bug
// https://github.com/vercel/next.js/issues/46356
export async function generateStaticParams() {

  const res = await fetch(`${SERVER_URL}/posts`, {
    method: "GET",
    mode: 'cors',
    credentials: 'include'        
  });
  if (res.status === 401) {
    console.log("unauthorized request.")
    return []
  } 
  if (res.status === 403) {
    console.log("forbidden request.")
    return []
  }
  const posts = await res.json()
                
  return posts.map((post) => ({
    id: post._id,
  }))
}
 
const getPost = cache(async(params) => {
  if (params.length === 0) {
    return undefined
  }
  const res = await fetch(`${SERVER_URL}/posts/${params.id}`, {
    method: "GET",
    mode: 'cors',
    credentials: 'include'        
  })
  if (res.status === 401) {
    console.log("unauthorized request.")
    return undefined
  } 
  if (res.status === 403) {
    console.log("forbidden request.")
    return undefined
  }
  const post = await res.json()
  return post
})

// client component doesn't support async/await yet
// using 'cache' to wrap the async function and 
// 'use' to handle promise is a current workaround
// https://github.com/vercel/next.js/issues/42180
export default function Post({params}) {

  const router = useRouter()

  const post = use(getPost(params))
  if (!post) {
    router.push('/')
  }

  const [showDelete, setShowDelete] = useState(false);
  const [showModify, setShowModify] = useState(false);

  const PostDetail = ({ postTitle, postContent, dateCreated, isPublished}) => {

    const lastModified = post.date_updated ? (
      <div className="mb-6 font-light">
        Last Modified: <Date dateString={post.date_updated} />
      </div>
    ) : null;

    return (
      <>
        <div className="text-4xl mb-4">{postTitle}</div>
        <div className="mb-6 font-light"><Date dateString={dateCreated} /></div>
        { lastModified }
        <div className="mb-6 font-light">{isPublished ? 'Published' : 'Draft'}</div>
        <article className="prose md:prose-lg mb-8">{postContent}</article>

        <button onClick={ () => setShowModify(true) } className="bg-teal-500 p-2">Modify</button>
        <button onClick={ () => setShowDelete(true) } className="bg-teal-500 p-2 mx-4">Delete</button>
        <div>
          <button onClick={ () => router.push('/dashboard') } className="bg-teal-500 p-2 my-8">Back To Dashboard</button>
        </div>
      </>
    )
  }

  const handleDelete = async (postId) => {
    const res = await fetch(`${SERVER_URL}/posts/${postId}`, {
      method: "DELETE",
      mode: 'cors',
      credentials: 'include'        
    })
    if (res.status === 204) {
      console.log("post deleted successfully")
      return router.push('/dashboard')
    }
    if (res.status === 401) {
      console.log("unauthorized request.")
      return router.push('/')
    } 
    if (res.status === 403) {
      console.log("forbidden request.")
      return router.push('/')
    }  
    console.log("delete failed")
    setShowDelete(false)
  }

  const DeleteComp = ({postTitle, postId}) => {

    return (
      <>
        <p>Are you sure to delete the article? </p>
        <span>{postTitle}</span>
        <div className="flex justify-start gap-4 mt-4">
          <input type="button" name="submit-btn" value="Cancel" onClick={() => setShowDelete(false)}
            className="form-input w-24 border-none mt-4 bg-teal-500 p-2 hover:bg-teal-600 active:bg-teal-700 cursor-pointer" />

          <input type="button" name="submit-btn" value="Delete" onClick={() => handleDelete(postId)}
            className="form-input w-24 border-none mt-4 bg-red-500 p-2 hover:bg-red-600 active:bg-red-700 cursor-pointer" />
        </div>
      </>
    )
  }

  // conditional rendering
  const renderComponent = (post) => {

    const decodedTitle = decode(`<p>${post.title}</p>`, {level: 'html5'});
    const parsedTitle = parse(decodedTitle);

    const decodedContent = decode(post.content, {level: 'html5'});
    const parsedContent = parse(decodedContent)
    
    if (showDelete) {
      return (
        <DeleteComp postTitle = {decodedTitle.slice(3, -4)} postId = {post._id} />
      )
    }
    if (showModify) {
      return (
        <UpdatePost postTitle = {decodedTitle.slice(3, -4)} postContent = {decodedContent} postId = {post._id}/>
      )
    }
    return (
      <PostDetail postTitle = {parsedTitle} 
        postContent = {parsedContent} 
        dateCreated={post.date_created} 
        isPublished = {post.is_published} />
    )
  }

  return (
    <div className="min-h-screen p-12">
      { renderComponent(post) }   
    </div>    
  )
}