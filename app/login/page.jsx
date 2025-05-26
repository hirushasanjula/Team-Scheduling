"use client"

import LoginForm from '@/components/forms/LoginForm'
import Link from 'next/link'
import { useState } from 'react'
import { Building2, Users, Clock, ArrowRight } from 'lucide-react'
import { RiAdminLine } from "react-icons/ri";

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState('MANAGER')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-600 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-3xl"></div>
      </div>

      <div className="relative min-h-screen flex">
        {/* Left Side - Hero Section */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 xl:px-20">
          <div className="max-w-lg">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Team Scheduling</h1>
            </div>
            
            <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
              Manage your team's schedule with
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> confidence</span>
            </h2>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Streamline shift management, track time efficiently, and keep your team organized with our intuitive scheduling platform.
            </p>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Building2 className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-gray-700">Complete company management</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-gray-700">Employee scheduling & tracking</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Clock className="h-4 w-4 text-purple-600" />
                </div>
                <span className="text-gray-700">Real-time time tracking</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
          <div className="w-full max-w-md">
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-8">
              <div className="inline-flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Team Scheduling</h1>
              </div>
            </div>

            {/* Login Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              {/* Role Selection */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-700 mb-4 text-center">Choose your role</h3>
                <div className="flex space-x-2 bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => setSelectedRole('MANAGER')}
                    className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
                      selectedRole === 'MANAGER'
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md transform scale-[1.02]'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    <RiAdminLine className="h-4 w-4" />
                    <span>Manager</span>
                  </button>
                  <button
                    onClick={() => setSelectedRole('EMPLOYEE')}
                    className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
                      selectedRole === 'EMPLOYEE'
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md transform scale-[1.02]'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    <Users className="h-4 w-4" />
                    <span>Employee</span>
                  </button>
                </div>
              </div>
              
              {/* Login Form */}
              <LoginForm selectedRole={selectedRole} />
            </div>
            
            {/* Footer Links */}
            <div className="mt-8 text-center">
              {selectedRole === 'MANAGER' ? (
                <Link 
                  href="/register"
                  className="group inline-flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  <span>Don't have a company account?</span>
                  <span className="font-semibold text-blue-600 group-hover:text-blue-700">Register here</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-amber-800 text-sm font-medium">
                    📧 Need access? Contact your manager or HR department
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}