import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/home/Home'
import Signup from './pages/auth/signup/Signup'
import Login from './pages/auth/login/Login'
import Sidebar from './components/common/Sidebar'
import RightPanel from './components/common/RightPanel'
import NotificationPage from './pages/notification/NotificationPage'
import ProfilePage from './pages/profile/Profile'
import { Toaster } from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'
import LoadingSpinner from './components/common/LoadingSpinner'

function App() {

	const {data,isPending,isError,error} = useQuery({
		queryKey: ["authUser"],
		queryFn: async()=>{
			try {
				const res = await fetch("/api/auth/me")
				const data = await res.json()
				if(data.message) return null
				if(!res.ok){
					throw new Error(data.message || "Something went wrong")
				}
				console.log("AuthUser",data)
				return data
			} catch (error) {
				throw error
			}
		},
		retry: false
	})
	console.log(data)

	if(isPending){
		return (
			<div className='flex items-center justify-center h-screen'>
				<LoadingSpinner size='lg'></LoadingSpinner>
			</div>
		)
	}
  return (
    <div className='flex max-w-6xl h-auto mx-auto'>
       {data && <Sidebar></Sidebar>}
			<Routes>
				<Route path='/' element={data ? <Home></Home> : <Navigate to='/login'></Navigate>} />
				<Route path='/signup' element={!data ?<Signup /> : <Navigate to='/'></Navigate>} />
				<Route path='/login' element={!data ?<Login /> : <Navigate to='/'></Navigate>} />
				<Route path='/profile/:username' element={data ? <ProfilePage /> : <Navigate to='/login'></Navigate>} />
				<Route path='/notifications' element={data ?<NotificationPage /> : <Navigate to='/login'></Navigate>} />
			</Routes>
       {data && <RightPanel></RightPanel>}
	  <Toaster></Toaster>
		</div>
  )
}

export default App
