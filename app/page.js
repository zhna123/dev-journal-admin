import LogIn from "./login";
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default function Page() {
  const cookiesStore = cookies()
  if (cookiesStore.has('jwtExpiration')) {
    const jwtExpiration = cookiesStore.get('jwtExpiration')
    const jwtExpirationTS = Date.parse(jwtExpiration.value);
    const currentTimestamp = new Date().getTime();

    if (jwtExpirationTS && currentTimestamp < parseInt(jwtExpirationTS)) {
      // JWT is not expired
      console.log('JWT is valid');
      return redirect('/dashboard')
    } 
  } 

  return (
    <LogIn />
  )
}