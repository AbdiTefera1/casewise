// import Head from 'next/head'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Benefits from '@/components/Benefits'
import Features from '@/components/Features'
import Pricing from '@/components/Pricing'
import Blog from '@/components/Blog'
import Footer from '@/components/Footer'



export default function Home() {
  return (
    <div className="min-h-screen bg-white">      
      <Navbar />
      <Hero />
      <Features />
      <Benefits />
      <Pricing />
      <Blog />
      <Footer />
    </div>
  )
}