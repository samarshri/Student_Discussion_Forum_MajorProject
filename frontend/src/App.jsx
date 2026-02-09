import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreatePost from './pages/CreatePost';

import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import PostDetail from './pages/PostDetail';
import './styles/global.css';
import Footer from './components/Footer';
import Intro from './components/Intro';


function App() {
    const [showIntro, setShowIntro] = React.useState(true);

    return (
        <AuthProvider>
            {showIntro && <Intro onComplete={() => setShowIntro(false)} />}
            <Router>
                <div className="d-flex flex-column min-vh-100">
                    {/* Actually, if we hide it with d-none, then it might pop in abruptly after fadeOut from Intro. 
                        Better to let it render behind the intro. 
                        But we should check if Navbar/Footer have z-index issues.
                        Intro has z-index 9999, so it should be fine. 
                    */}
                    <div className="d-flex flex-column min-vh-100">
                        <Navbar />
                        <div className="flex-grow-1">
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                                <Route path="/profile/:username" element={<Profile />} />
                                <Route path="/post/:id" element={<PostDetail />} />
                                <Route
                                    path="/create-post"
                                    element={
                                        <PrivateRoute>
                                            <CreatePost />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/edit-profile"
                                    element={
                                        <PrivateRoute>
                                            <EditProfile />
                                        </PrivateRoute>
                                    }
                                />
                            </Routes>
                        </div>
                        <Footer />
                    </div>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
