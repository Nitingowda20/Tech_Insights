import React from 'react'
import {BrowserRouter , Routes , Route} from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import SignInPage from './pages/SignInPage'
import SignOutPage from './pages/SignOutPage'
import AboutPage from './pages/AboutPage'
import HeaderSec from './components/HeaderSec'
import FooterSec from './components/FooterSec'
import PrivateRoute from './components/PrivateRoute'


export default function App() {
  return (
    <BrowserRouter>
      <HeaderSec />
      
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/sign-in' element={<SignInPage />}></Route>
        <Route path='/sign-out' element={<SignOutPage />}></Route>
        <Route path='/about' element={<AboutPage />}></Route>
        <Route element={ <PrivateRoute />} >
          <Route path='/dashboard' element={<Dashboard />}></Route>
        </Route>        
        <Route path='/project' element={<Projects />}></Route>
      </Routes>

      <FooterSec />
    </BrowserRouter>
  )
}