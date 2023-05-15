import {createBrowserRouter} from "react-router-dom";
import DefaultLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";

import Dashboard from "./views/dashboard/Dashboard";

import { Plainte } from "./components/profile/Plainte";
import { Profile } from "./components/profile/Profile";

import Login from "./views/auth/Login";

import TableFormation from "./views/tables/TableFormation";
import TableAllModule from "./views/tables/TableAllModule";
import AddFormation from "./views/gestionFormation/AddFormation";
import EditFormation from './views/gestionFormation/EditFormation';
import TableModule from "./views/tables/TableModule";
import AddModule from "./views/gestionFormation/AddModule";
import EditModule from './views/gestionFormation/EditModule';
import TableMedia from "./views/Tables_Media/TableMedia";
import GestionDemandeAcces from "./views/GestionDemandes/GestionDemandeAcces";
import AddMedia from "./views/Gestion_Media/AddMedia";

import ListeCertificatAdmin from "./views/certificat_resultat/ListeCertificatAdmin";
import Resultat from "./views/certificat_resultat/Resultat";

import NotFound from "./views/NotFound";
import RequireAuth from "./components/hooks/RequireAuth";
import About from "./views/About";


import GestApprenant from "./components/gestion_apprenants/GestApprenant";
import ApprenantDetail from "./components/gestion_apprenants/ApprenantDetail";
import AddApprenant from "./components/gestion_apprenants/AddApprenant";
import AddResponsable from "./views/gestion_responsable/AddResponsable";
import GestResponsable from "./views/gestion_responsable/GestResponsable";

import ActivationModuleApprenant from "./views/GestionDemandes/ActivationModuleApprenant";
import Unauthorized from "./views/Unauthorized";
import EditApprenant from "./components/gestion_apprenants/EditApprenant";
import EditResponsable from "./views/gestion_responsable/EditResponsable";
import Tesadmine from "./views/test/test"
import TableChapitre from "./views/gestionChapitre/TableChapitre";
import ListFeedBack from "./views/gestion_feedback/ListFeedBack";
import GestionAccesModule from "./views/GestionDemandes/GestionAccesModule";
import Tutorial from "./views/Tutorial";
import { Ticket } from "./components/profile/Ticket";
import Suivi_Plainte from "./components/profile/Suivi_Plainte";



const router = createBrowserRouter([
    {
      path: '/',
      element: <DefaultLayout/>, 
      children: [
        // {

        //   path: '/',
        //   element: <RequireAuth  element={<Dashboard />} />
        // },

          {

          path: '/',
          element: <RequireAuth  element={<Dashboard />} allowedRoles={['SUPERADMIN', 'ADMIN','MASTER']} />
        },

        {
          path: '/formations',
          element: <RequireAuth  element={<TableFormation />} />
        },
        {
          path: '/test',
          element: (           
             <Tesadmine/>            
          ),
        },

        {
          path: '/nouvelle_formation',          
          element: <RequireAuth  element={<AddFormation />} allowedRoles={['SUPERADMIN', 'ADMIN','MASTER']} />
        },

        {
          path: '/modifier_formation',
          element: <RequireAuth  element={<EditFormation />} allowedRoles={['SUPERADMIN', 'ADMIN','MASTER']} />
        },

        {
          path: '/list_allModules',
          element: (           
             <TableAllModule/>            
          ),
        },

        {
          path: '/list_modules',
          element: <RequireAuth  element={<TableModule />} allowedRoles={['RESPO']} />
        },

        {
          path: '/ajout_module',
          element: <RequireAuth  element={<AddModule />} allowedRoles={['SUPERADMIN','ADMIN','MASTER']} />

        },
        {
          path: '/modifier_module',
          element: <RequireAuth  element={<EditModule />} allowedRoles={['SUPERADMIN','RESPO','MASTER']} />
        },
        {
          path: '/list_chapiter',
          element: <RequireAuth  element={<TableChapitre />} allowedRoles={['SUPERADMIN','RESPO','MASTER']} />
        },

        {
          path: '/gestionAcces',
          element: <RequireAuth  element={<GestionAccesModule />} allowedRoles={['SUPERADMIN','RESPO','MASTER']} />
        },

        {
          path: '/list_activation',
          element: <RequireAuth  element={<ActivationModuleApprenant />} allowedRoles={['SUPERADMIN','RESPO','MASTER']} />
        },

        {
          path: '/list_feedback',
          element: <RequireAuth  element={<ListFeedBack />} allowedRoles={['SUPERADMIN','RESPO','MASTER']} />
        },

        {
          path: '/list_medias',
          element: <RequireAuth  element={<TableMedia />} allowedRoles={['SUPERADMIN','RESPO','MASTER']} />
        },

        {
          path: '/ajout_medias',
          element: (           
             <AddMedia/>            
          ),
        },
        {
          path: '/resultats',
          element: <Resultat/>
        },
        {
          path: '/certificats',
          element: <ListeCertificatAdmin/>
        },

        {
          path: '/demandes',
          element: <RequireAuth  element={<GestionDemandeAcces />} />

        },
        {
          path: '/tickets',
          element: <RequireAuth  element={<Plainte />} allowedRoles={['SUPERADMIN', 'ADMIN','MASTER']} />        
        },
        {

          path: '/tutoriel',
          element: <RequireAuth element={<Tutorial/>} />
        },
        {
          path: '/profile',
          element: <RequireAuth  element={<Profile />} />        
        },
        {
          path: '/apprenants',
          element: <RequireAuth  element={<GestApprenant />} />        
        },
        {
          path: '/apprenant/',
          element: <RequireAuth  element={<ApprenantDetail />} />        
        },
        {
          path: '/editApprenant/',
          element: <RequireAuth  element={<EditApprenant />} allowedRoles={['SUPERADMIN','MASTER']} />        
        },
        {
          path: '/editResponsable/',
          element: <RequireAuth  element={<EditResponsable />} allowedRoles={['SUPERADMIN','MASTER']} />        
        },
        {
          path: '/addApprenant',
          element: <RequireAuth  element={<AddApprenant />} allowedRoles={['SUPERADMIN','MASTER']} />        
        },
        {
          path: '/responsables',
          element: <RequireAuth  element={<GestResponsable />} allowedRoles={['SUPERADMIN', 'ADMIN','MASTER']} />        
        },
        {
          path: '/addResponsable',
          element: <RequireAuth  element={<AddResponsable />} allowedRoles={['SUPERADMIN','MASTER']} />       
         },
          {
            path: '/aPropos',
            element: <RequireAuth element={<About />} />
          },
          {
            path: '/suggestion',
            element: <RequireAuth element={<Ticket />} allowedRoles={['RESPO', 'ADMIN']} />
          },
          {
            path: '/mesTickets',
            element: <RequireAuth element={<Suivi_Plainte />} />
          },
      ]
    },
    {
      path: '/',
      element: <GuestLayout/>,
      children: [
        {
          path: '/login',
          element: <Login/>
        },
      ]
    },
    {
      path: "/unauthorized",
      element: <Unauthorized/>
    },
    {
      path: "*",
      element: <NotFound/>
    }
  ])
  
  export default router;