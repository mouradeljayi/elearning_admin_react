import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TableFormation from './tables/TableFormation';
import AddFormation from './gestionFormation/AddFormation';
import TableModule from './tables/TableModule';
import AddModule from './gestionFormation/AddModule';
import AddMedia from './Gestion Media/AddMedia'
import EditFormation from './gestionFormation/EditFormation';
import TableMedia from './Tables_Media/TableMedia';

function EspaceFormation() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TableFormation />}></Route>
        <Route path="/nouvelle_formation" element={<AddFormation/>}></Route>
        <Route path="/modifier_formation" element={<EditFormation/>}></Route>
        <Route path="/list_modules" element={<TableModule/>}></Route>
        <Route path="/list_medias" element={<TableMedia/>}></Route>
        <Route path="/nouveau_module" element={<AddModule/>}></Route>
        <Route path="/nouvelle_media" element={<AddMedia/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default EspaceFormation