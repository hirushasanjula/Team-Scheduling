"use client";

import React, { useState } from 'react';
import { Clock, Users, Calendar, BarChart3, CheckCircle, Shield, Zap, ArrowRight, Star, Menu, X } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const features = [
    {
      icon: <Calendar className="h-8 w-8" />,
      title: "Smart Scheduling",
      description: "Create and manage shifts with intelligent conflict detection and automatic notifications."
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Time Tracking",
      description: "Accurate clock-in/out system with real-time monitoring and overtime alerts."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Team Management",
      description: "Effortlessly manage employees, roles, and permissions from one central dashboard."
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Operations Manager",
      company: "TechCorp",
      content: "This platform transformed how we manage our team schedules. What used to take hours now takes minutes.",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "HR Director",
      company: "RetailPlus",
      content: "The time tracking features are incredibly accurate and the reporting saves us so much administrative work.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Team Lead",
      company: "ServiceFirst",
      content: "Our employees love the intuitive interface. No more confusion about shifts or schedules.",
      rating: 5
    }
  ];

  const stats = [
    { number: "10,000+", label: "Teams Managed" },
    { number: "500K+", label: "Shifts Scheduled" },
    { number: "99.9%", label: "Uptime" },
    { number: "24/7", label: "Support" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden ">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white/90 text-sm font-medium mb-8">
              <Zap className="h-4 w-4 mr-2" />
              Now with AI-powered scheduling
            </div>
            
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Team Scheduling
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Made Simple
              </span>
            </h1>
            
            <p className="text-xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
              Transform your workforce management with intelligent scheduling, precise time tracking, 
              Active Time Entries, Manage Employee. Everything you need to optimize your team's productivity.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href={'/login'} className="group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 flex items-center">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all border border-white/30">
                Watch Demo
              </button>
            </div>
            
            <div className="mt-16 flex justify-center items-center space-x-8 text-white/60">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-white/70 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Everything you need to manage your team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Streamline your workforce management with our comprehensive suite of tools designed for modern businesses.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}