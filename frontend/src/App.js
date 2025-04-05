import { useState } from 'react'
// import "./styles/global.css"
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LegalAidCaseInput from "./components/LegalAidCaseInput"
import LegalAnalysisChatbot from './components/LegalAnalysisChatbot';
import LegalChatbot from './components/LegalChatbot';
import NyaaysathiLandingPage from './components/NyaaySaathiLandingPage';


function App() {
  
  return (
    <>
    <BrowserRouter>
      <Routes>

          {/* <Route path="" element={<LegalAidCaseInput />} /> */}
          <Route path="" element={<NyaaysathiLandingPage />} />
          <Route path="/analyzer" element={<LegalAnalysisChatbot />} />
          <Route path="/chatbot" element={<LegalChatbot />} />
          {/* <Route path="home" element={<Home />} />
          <Route path="audichecker" element={<Audichecker />} /> */}
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
