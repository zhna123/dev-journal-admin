import Date from '../../components/date';
import Link from 'next/link'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import parse from 'html-react-parser'
import {decode} from 'html-entities';

const getPosts = async() => {
  const headersInstance = headers()
  const cookie = headersInstance.get('Cookie')
  try {
    const res = await fetch('http://localhost:3000/posts', { 
      method: "GET",
      mode: 'cors',
      headers: { cookie },
      // next: { revalidate: 0 }
      // *** include credential won't work in server component
      // *** Need to attach cookie using headers() function like above
      // credentials: 'include'        
    })
    if (res.status === 401) {
      console.log("unauthorized request.")
      return undefined
    } 
    if (res.status === 403) {
      console.log("forbidden request.")
      return undefined
    }
    return await res.json()
    
  } catch (e) {
    console.log("error retrieving all posts:" + e)
  }
}

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

export default async function Dashboard() {

  const posts = await getPosts()
  if (!posts) {
    redirect('/')
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