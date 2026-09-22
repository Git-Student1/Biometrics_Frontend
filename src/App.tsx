import './App.css'
import {BrowserRouter, NavLink, Route, Routes} from 'react-router-dom';
import {FaceRecognitionProgram} from "./pages/FaceRecognitionProgram.tsx";
import {About} from "./pages/About.tsx";
import style from "./Styles/Navbar.module.css"


function App() {



    return (
        <BrowserRouter>
            {/* Your app content */}
            <nav className={style.navbar}>
                <NavLink className={style.navbarItem} to="/">FaceRecognition</NavLink> |{" "}
                <NavLink className={style.navbarItem} to="/about">About</NavLink> {" "}
            </nav>


            <Routes>
                <Route path="/" element={<FaceRecognitionProgram/>} />
                <Route path="/about" element={<About />} />
            </Routes>
        </BrowserRouter>)







}
export default App;