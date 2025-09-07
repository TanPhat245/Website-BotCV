import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import PageWrapper from './components/PageWrapper'

import Home from './pages/Home'
import ApplyJob from './pages/ApplyJob'
import Application from './pages/Application'
import CollectionJobs from './pages/CollectionJobs'
import Handbook from './pages/Handbook'
import RecruiterLogin from './pages/RecruiterLogin'
import Dashboard from './pages/Recuiter/Dashboard'
import ManageJobs from './pages/Recuiter/ManageJobs'
import ViewApplication from './pages/Recuiter/ViewApplication'
import AddJob from './pages/Recuiter/AddJob'
import AccoutRecuiter from './pages/Recuiter/AccoutRecuiter'
import InfoCompany from './pages/Recuiter/InfoCompany'
import AddCompany from './pages/Recuiter/AddCompany'
import Info from './pages/Info'
import SaveJob from './pages/SaveJob'
import Login from './pages/Login'
import DashboardHome from './pages/Recuiter/DashboardHome'
import 'quill/dist/quill.snow.css'
import MarqueeBanner from './components/MarqueeBanner'
import RegisPackage from './pages/Recuiter/RegisPackage'
import InfoPackage from './pages/Recuiter/InfoPackage'
import ListPackage from './pages/Recuiter/ListPackage'
import { ToastContainer } from 'react-toastify'
import EditJob from './pages/Recuiter/EditJob'
import FloatingIconBar from './components/FloatingIconBar'
import AdminLogin from './pages/Admin/AdminLogin'
import AdminHome from './pages/Admin/AdminHome'
import AdminDashBoard from './pages/Admin/AdminDashBoard'
import AdminIndustry from './pages/Admin/AdminIndustry'
import AdminAddIndustry from './pages/Admin/AdminAddIndustry'
import AdminEditIndustry from './pages/Admin/AdminEditIndustry'
import AdminListAccout from './pages/Admin/AdminListAccout'
import AdminListApply from './pages/Admin/AdminListApply'
import AdminListPackage from './pages/Admin/AdminListPackage'
import AdminRoute from './components/AdminRoute'
import CompanyInfo from './pages/CompanyInfo'
import InfoApply from './pages/Recuiter/InfoApply'
import VerifyCompany from './pages/VerifyCompany'
import VerifyAccount from './pages/Recuiter/VerifyAccount'

const App = () => {
  const location = useLocation();
  const path = location.pathname;
  const hiddenPaths = ["/dashboard", "/login", "/recruiterLogin", "/admin-login", "/dashboard-admin"];
  const shouldShowFloatingIconBar = !hiddenPaths.some((path) =>
    location.pathname.startsWith(path)
  );
  return (
    <>
    <ToastContainer position= "bottom-left" autoClose={1500} />
    <AnimatePresence mode="wait"><MarqueeBanner/>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/apply-job/:id" element={<PageWrapper><ApplyJob /></PageWrapper>} />
        <Route path="/collection-jobs" element={<PageWrapper><CollectionJobs /></PageWrapper>} />
        <Route path="/applications" element={<PageWrapper><Application /></PageWrapper>} />
        <Route path="/handbook" element={<PageWrapper><Handbook /></PageWrapper>} />
        <Route path="/recruiterLogin" element={<PageWrapper><RecruiterLogin /></PageWrapper>} />
        <Route path="/info" element={<PageWrapper><Info /></PageWrapper>} />
        <Route path="/saved-jobs" element={<PageWrapper><SaveJob /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/company-info/:id" element={<PageWrapper><CompanyInfo/></PageWrapper>}/>
        <Route path="/verify-company/:token" element={<PageWrapper><VerifyCompany/></PageWrapper>}/>
        <Route path="/admin-login" element={<PageWrapper><AdminLogin/></PageWrapper>}/>

        <Route path="/dashboard" element={<PageWrapper><Dashboard /></PageWrapper>}>
          <Route index element={<PageWrapper><DashboardHome /></PageWrapper>} />
          <Route path="add-job" element={<PageWrapper><AddJob /></PageWrapper>} />
          <Route path="manage-jobs" element={<PageWrapper><ManageJobs /></PageWrapper>} />
          <Route path="edit-job/:id" element={<PageWrapper><EditJob /></PageWrapper>} />
          <Route path="view-applications" element={<PageWrapper><ViewApplication /></PageWrapper>} />
          <Route path="info-account" element={<PageWrapper><AccoutRecuiter /></PageWrapper>} />
          <Route path="info-company" element={<PageWrapper><InfoCompany /></PageWrapper>} />
          <Route path="add-info-company" element={<PageWrapper><AddCompany /></PageWrapper>} />
          <Route path="regis-package" element={<PageWrapper><RegisPackage /></PageWrapper>} />
          <Route path="info-package" element={<PageWrapper><InfoPackage /></PageWrapper>} />
          <Route path="list-package" element={<PageWrapper><ListPackage /></PageWrapper>} />
          <Route path="info-applier/:applyId" element={<PageWrapper><InfoApply /></PageWrapper>} />
          <Route path="verify" element={<PageWrapper><VerifyAccount /></PageWrapper>} />
        </Route>

        <Route path="/dashboard-admin" element={<AdminRoute><PageWrapper><AdminHome /></PageWrapper></AdminRoute>}> /
          <Route index element={<PageWrapper><AdminDashBoard /></PageWrapper>} />
          <Route path="add-industry" element={<PageWrapper><AdminAddIndustry /></PageWrapper>} />
          <Route path="list-industry" element={<PageWrapper><AdminIndustry /></PageWrapper>} />
          <Route path="edit-industry/:id" element={<PageWrapper><AdminEditIndustry /></PageWrapper>} />
          <Route path="list-account" element={<PageWrapper><AdminListAccout /></PageWrapper>} />
          <Route path="list-apply" element={<PageWrapper><AdminListApply /></PageWrapper>} />
          <Route path="list-package" element={<PageWrapper><AdminListPackage /></PageWrapper>} />
        </Route>
      </Routes>
    </AnimatePresence>
    {shouldShowFloatingIconBar && <FloatingIconBar />}
    </>
  )
}
export default App
