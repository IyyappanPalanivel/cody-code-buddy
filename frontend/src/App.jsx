import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './pages/Home';

function App() {
  return (
    <div className="min-h-screen bg-black text-white font-mono w-full">
      <h1 className="text-3xl p-4 font-bold">⚡ Cody – Your Code Buddy</h1>
      <Home />
    </div>
  )
}

export default App
