
const handleError = async (res) => {
  const error = await res.json()
  if (res.status === 500) {    
    throw new Error("server error 500:" + error)
  } else {
    throw new Error("unknow..:" + error)
  }
}

export const saveData = async(data, uri, method, publish = false) => {
  try {
    const res = await fetch(uri, {
      method: method,
      mode: 'cors',
      credentials: 'include',
      body: JSON.stringify({...data, is_published: publish}),
      headers: { 
        'Content-Type': 'application/json',
      }
    })     

    if (res.ok) {  
      return await res.json()
    } else if (res.status === 401) {
      console.log("authorization failed.")
      return null
    } else if (res.status === 403) {
      console.log("forbidden request")
      return null
    } else {
      handleError(res)
    }
  } catch (e) {
    console.log("error when saving data:" + e)
  }
}
