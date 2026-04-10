import React, {useState, createContext} from 'react'

const AuthContext = createContext()

const AuthProvider = ({children}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
        !!localStorage.getItem('accessToken') // The double exclamation sign at the back of the code will convert the 
                                                // line to eith true or false (boolean)
  )
  return (
    <AuthContext.Provider value={{isLoggedIn, setIsLoggedIn}}>
        {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
export {AuthContext}