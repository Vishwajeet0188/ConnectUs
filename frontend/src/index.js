  import React from 'react';
  import ReactDOM from 'react-dom/client';
  import {BrowserRouter, Routes, Route} from 'react-router-dom';
  import './index.css';
  import Navbar from './landingPage/Navbar';
  import HomePage from './landingPage/home/HomePage';
  import Footer from './landingPage/Footer';
  import ResourcePage from './landingPage/resources/ResourcePage';
  import LoginPage from './landingPage/login/LoginPage';
  import SignupPage from './landingPage/signup/SignupPage';
  import Assessment from './landingPage/assesment/Assesment';
  import CommunityPage from "./landingPage/community/CommunityPage";
  import AboutPage from './landingPage/about/AboutPage';
  import SleepCycle from './landingPage/resourcecontent/SleepCycle';
  import ExamStress from './landingPage/resourcecontent/ExamStress';
  import ImposterSyndrome from './landingPage/resourcecontent/ImposterSyndrome';
  import ExamAnxiety from './landingPage/resourcecontent/ExamAnxiety';
  import SmartStudy from './landingPage/resourcecontent/SmartStudy';
  import SleepHygiene from './landingPage/resourcecontent/SleepHygine';
  import MindFull from './landingPage/resourcecontent/MindFull';
  import TimeManagement from './landingPage/resourcecontent/TimeManagment';
  import DailyMindfulness from './landingPage/resourcecontent/DailyMindFulness';
  import ActiveRecall from './landingPage/resourcecontent/ActiveRecall';
  import ResumeWritingMasterclass from './landingPage/resourcecontent/ResumeWritting';
  import ExamAnxietyCopingKit from './landingPage/resourcecontent/ExamAnxietyCopingKit';
  import Dashboard from './landingPage/dashboard/Dashboard';
  import { AuthProvider } from "../src/context/AuthContext";
  import AdminDashboard from './landingPage/admin/AdminDashboard';
  import NotFound from "./pages/NotFound";

  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <AuthProvider>
    <BrowserRouter>
    <Navbar/>
      <Routes>
        <Route path = "/" element={<HomePage/>} />
        <Route path='/resources' element={<ResourcePage/>} />
        <Route path='/login' element={<LoginPage/>} />
        <Route path='/signup' element={<SignupPage/>} />
        <Route path='/assesment' element={<Assessment/>} />
        <Route path='/community' element={<CommunityPage/>} />
        <Route path='/about' element={<AboutPage/>} />
        <Route path='/sleepcycle' element={<SleepCycle/>} />
        <Route path='/examstress' element={<ExamStress />} />
        <Route path='/impostersyndrome' element={<ImposterSyndrome/>} />
        <Route path='/examanxiety' element={<ExamAnxiety/>} />
        <Route path='/smartstudy' element={<SmartStudy/>} />
        <Route path='/sleephygine' element={<SleepHygiene/>} />
        <Route path='/mindfull' element={<MindFull/>} />
        <Route path='/timemanagment' element={<TimeManagement/>} />
        <Route path='/dailymindfullness' element={<DailyMindfulness/>} />
        <Route path='/activerecall' element={<ActiveRecall/>} />
        <Route path='/resumewritting' element={<ResumeWritingMasterclass/>} />
        <Route path='/examanxietycopingkit' element={<ExamAnxietyCopingKit/>}/>
        <Route path='/dashboard' element={<Dashboard/>} />
        <Route path='/admin/dashboard' element={<AdminDashboard/>} />
        <Route path='*' element={<NotFound/>} />
      </Routes>
      <Footer/>
    </BrowserRouter>
    </AuthProvider>
  );

  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

