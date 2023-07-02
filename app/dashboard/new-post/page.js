'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react";
import UpdatePost from "./update";
import { saveData } from '@/lib/db';

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export default function NewPost() {

  const router = useRouter()

  const [postId, setPostId] = useState(null)

  // create a post(unpublished) and get it's id for auto save updating
  useEffect(() => {
    (async () => {
      const data = {title:"", content:""}
      const doc = await saveData(data, `${SERVER_URL}/posts`, 'POST')

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