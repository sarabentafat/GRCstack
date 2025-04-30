import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Contact from "./pages/Contact"
import Admin from "./pages/Admin"
import FlashCards from "./pages/FlashCards"
import Classes from "./components/Classes";
import Settings from "./pages/Settings";
import MainNavs from "./components/MainNavs";
import Documents from "./pages/Documents";
import LandingPage from "./pages/LandingPage";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import Store from "./pages/Store";
import SignUpPage from "./pages/SignUpPage";
import Module from "./pages/Module";
import Field from "./pages/Field";
import Accueil from "./pages/Accueil";
import Favorite from "./pages/Favorite"
import Login from "./pages/Login";
import EmailVerify from "./pages/EmailVerify";
import CreatePacket from "./pages/CreatePacket";
import Packet from "./pages/Packet";
import Repository from "./components/Repository";
import UpdatePacket from "./components/UpdatePacket";
import EmailVerificationMessage from "./components/EmailVerificationMessage";
import PrivateRoute from "./components/PrivateRoute";
import Video from "./pages/Video";
import Folder from "./pages/Folder";
import Book from "./pages/Book";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/courses",
    element: <Video />,
  },
  {
    path: "/repository",
    element: <Repository />,
  },
  {
    path: "/user",
    element: (
      <PrivateRoute>
        <MainNavs /> {/* Only accessible if logged in */}
      </PrivateRoute>
    ),
    errorElement: <NotFound />,
    children: [
      {
        path: "admin",
        element: <Admin />,
      },

      {
        path: "classes",
        element: <Classes />,
      },
      {
        path: "accueil",
        element: <Accueil />,
      },
      {
        path: "settings",
        element: <Settings />,
      },

      {
        path: "profile/:profileId",
        element: <Profile />,
      },
      {
        path: "classes/packet/:id",
        element: <Packet />,
      },
      {
        path: "classes/book/:id",
        element: <Book />,
      },
      {
        path: "classes/profile/:profileId",
        element: <Profile />,
      },
      {
        path: "packet/edit/:id",
        element: <UpdatePacket />,
      },
      {
        path: "favorite/packet/:id",
        element: <Packet />,
      },
      {
        path: "documents/packet/:id",
        element: <Packet />,
      },
      {
        path: "documents/folder",
        element: <Folder />,
      },

      {
        path: "notifications",
        element: <Notifications />,
      },

      {
        path: "shop",
        element: <Store />,
      },
      {
        path: "favorite",
        element: <Favorite />,
      },
      {
        path: "packet/:id",
        element: <Packet />,
      },

      {
        path: "book/:id",
        element: <Book/>,
      },

      {
        path: "documents",
        element: <Documents />,
      },
      {
        path: "documents/field/:id",
        element: <Field />,
      },
      {
        path: "documents/createpacket",
        element: <CreatePacket />,
      },
      {
        path: "documents/field/:id/:moduleId",
        element: <Module />,
      },
      {
        path: "documents/profile/:id",
        element: <Profile />,
      },
      // {
      //   path: "profile/:id",
      //   element: <Profile />,
      // },
      {
        path: "documents/field/:subfielid/:moduleId/:id",
        element: <Packet />,
      },
      {
        path: "documents/field/module/flashcard",
        element: <FlashCards />,
      },
    ],
  },
  {
    path: "api/auth/:userId/verify/:token",
    element: <EmailVerify />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/emailsent",
    element: <EmailVerificationMessage />,
  },
  {
    path: "/profile/:id",
    element: <Profile />,
  },

  {
    path: "contacts/:contactId",
    element: <Contact />,
  },

  {
    path: "/signup",
    element: <SignUpPage />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
const App = () => {
 
  return (
    <div className=" font-sans bg-white dark:bg-gray-900 text-black dark:text-white">
      <RouterProvider router={router} />
    </div>
  );
};

export default App;

