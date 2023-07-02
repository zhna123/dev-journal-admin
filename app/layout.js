import './globals.css'
import { Rubik } from 'next/font/google'

const rubik = Rubik({ 
  subsets: ['latin'] ,
  variable: '--font-rubik',
})

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${rubik.variable} font-sans flex flex-col min-h-screen`}>
        <div className='flex flex-col min-h-screen'>
          <header className='min-h-fit flex justify-between items-center px-5 sm:px-12 bg-teal-100'>
            <div className='font-medium py-2'>A Developer&apos; Journal</div>
          </header>
            {children}
          <footer className='h-10 flex justify-center items-center mt-auto bg-teal-600'>
            <span>A Developer&apos;s Journal @zhna123</span>
          </footer> 
        </div>        
      </body>
    </html>
  )
}
