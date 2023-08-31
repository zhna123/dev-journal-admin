'use client'
import Date from '../../components/date';
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import parse from 'html-react-parser'
import {decode} from 'html-entities';
import { useState, useEffect } from 'react'

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export default function Dashboard() {

  const [posts, setPosts] = useState([])
  const router = useRouter()

  useEffect(() => {
    const fetchPosts = async() => {
      try {
        const res = await fetch(`${SERVER_URL}/posts`, { 
          method: "GET",
          mode: 'cors',
          next: { revalidate: 0 },
          // *** include credential won't work in server component
          credentials: 'include'        
        })
        if (res.status === 401) {
          console.log("unauthorized request.")
          return router.push('/')
        } 
        if (res.status === 403) {
          console.log("forbidden request.")
          return router.push('/')
        }
        const p = await res.json()
        setPosts(p)
        
      } catch (e) {
        console.log("error retrieving all posts:" + e)
      }
    }
    fetchPosts()
    
  }, [])

  const getArticles = (posts) => {
    return posts.map((post) => {
      let parsedTitle = '[No Title Provided]'
      if (post.title != '') {
        parsedTitle = parse(decode(`<p>${post.title}</p>`, {level: 'html5'}));
      }
      return (
        <tr key={post._id} className="border border-site-gray-700 hover:bg-white">
          <td className="text-left p-4"><Link href={`/posts/${post._id}`}>{parsedTitle}</Link></td>
          <td className="hidden sm:table-cell sm:text-left sm:p-4"><Date dateString={post.date_created} /></td>
          <td className="hidden sm:table-cell sm:text-left sm:p-4">{post.date_updated? <Date dateString={post.date_updated} /> : '-'}</td>
          <td className="text-left p-4">{post.is_published ? 'Published' : 'Draft'}</td>
        </tr>
      )
    })
  }
  
  return (
    <div className="min-h-screen p-5 sm:p-12 flex flex-col">
      <div className="flex items-center justify-center gap-8 mb-8">
        <p className="text-2xl">All Articles</p>
        <Link href={"/dashboard/new-post"}>
          <button className="bg-teal-500 p-2 hover:bg-teal-600 active:bg-teal-700">Create New</button>
        </Link>
      </div>
      <div>
        <table className="table-auto w-full">
          <thead>
            <tr className="bg-white border border-site-gray-700">
              <th className="text-left p-4">Title</th>
              <th className="hidden sm:table-cell sm:text-left sm:p-4">Date Created</th>
              <th className="hidden sm:table-cell sm:text-left sm:p-4">Last Modified</th>
              <th className="text-left p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {getArticles(posts)}
          </tbody>
        </table>
      </div>
    </div>
  )
} 