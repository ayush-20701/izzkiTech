import React from 'react'
import './App.css'
import Navbar from '../components/Navbar'
import Products from '../components/Products'

const App = () => {
  return (
    <div className='min-h-screen transition-colors duration-300'>
      <Navbar/>
      <Products/>
    </div>
  )
}

export default App
