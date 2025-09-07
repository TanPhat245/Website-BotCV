import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import JobList from '../components/JobList'
import Detail from '../components/Detail'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div>
        <Navbar/>
        <Hero/>
        <JobList/>
        <Detail/>
        <Footer/>
    </div>
  )
}

export default Home