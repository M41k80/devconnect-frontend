'use client'
import { useState } from 'react'
import { LoginForm } from './LoginFormModal'
import { RegisterForm } from './RegisterFormModal'


export function AuthModal({ open, onClose }: { open: boolean, onClose: () => void }) {
  const [isLogin, setIsLogin] = useState(true)

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-xl w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">✕</button>
        {isLogin
          ? <LoginForm onSwitch={() => setIsLogin(false)} />
          : <RegisterForm onSwitch={() => setIsLogin(true)} />}
      </div>
    </div>
  )
}