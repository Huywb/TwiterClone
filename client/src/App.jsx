import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/home/Home'
import Signup from './pages/auth/signup/Signup'
import Login from './pages/auth/login/Login'
import Sidebar from './components/common/Sidebar'
import RightPanel from './components/common/RightPanel'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='flex max-w-6xl h-auto mx-auto'>
      <Sidebar></Sidebar>
			<Routes>
				<Route path='/' element={<Home></Home>} />
				<Route path='/signup' element={<Signup />} />
				<Route path='/login' element={<Login />} />
			</Routes>
      <RightPanel></RightPanel>
		</div>
  )
}

export default App
