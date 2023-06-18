'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react";
import UpdatePost from "./update";
import { saveData } from '@/lib/db';

export default function NewPost() {

  const router = useRouter()

  const [postId, setPostId] = useState(null)

  // create a post(unpublished) and get it's id for auto save updating
  useEffect(() => {
    (async () => {
      const data = {title:"", content:""}
      const doc = await saveData(data, 'http://localhost:3000/posts', 'POST')

      if (doc !== null) {
        setPostId(doc._id);
      } else {
        router.replace('/')
      }
    })()
  }, [])

  return (
    <>
      { postId ? <UpdatePost postId = {postId} /> : <div />}
    </>
  )
}