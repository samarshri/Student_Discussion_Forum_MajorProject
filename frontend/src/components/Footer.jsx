import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="mt-auto bg-dark text-light pt-5 pb-3">
            <div className="container">
                <div className="row g-4">
                    {/* Column 1: Brand & About */}
                    <div className="col-lg-4 col-md-6">
                        <h5 className="text-white mb-3">
                            <i className="bi bi-mortarboard-fill me-2"></i>
                            Student Forum
                        </h5>
                        <p className="text-white-50 small">
                            A collaborative platform for students to share knowledge, discuss ideas, and grow together.
                            Built as a Major Project for the Department of Information Technology.
                        </p>
                        <div className="d-flex gap-3 mt-3">
                            <a href="#" className="text-white-50 hover-text-white"><i className="bi bi-github fs-5"></i></a>
                            <a href="#" className="text-white-50 hover-text-white"><i className="bi bi-linkedin fs-5"></i></a>
                            <a href="#" className="text-white-50 hover-text-white"><i className="bi bi-twitter fs-5"></i></a>
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className="col-lg-2 col-md-6">
                        <h6 className="text-white mb-3">Quick Links</h6>
                        <ul className="list-unstyled text-white-50 small">
                            <li className="mb-2"><Link to="/" className="text-decoration-none text-white-50 hover-text-white">Home</Link></li>
                            <li className="mb-2"><Link to="/login" className="text-decoration-none text-white-50 hover-text-white">Login</Link></li>
                            <li className="mb-2"><Link to="/register" className="text-decoration-none text-white-50 hover-text-white">Register</Link></li>
                            <li className="mb-2"><Link to="#" className="text-decoration-none text-white-50 hover-text-white">About Us</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Contact/Dept Info */}
                    <div className="col-lg-3 col-md-6">
                        <h6 className="text-white mb-3">Department Info</h6>
                        <ul className="list-unstyled text-white-50 small">
                            <li className="mb-2"><i className="bi bi-building me-2"></i> Dept. of Information Technology</li>
                            <li className="mb-2"><i className="bi bi-calendar-event me-2"></i> Batch: 2022–2026</li>
                            <li className="mb-2"><i className="bi bi-person-badge me-2"></i> Guide: Prof. Ram Ratan Ahirwal</li>
                        </ul>
                    </div>

                    {/* Column 4: Developers */}
                    <div className="col-lg-3 col-md-6">
                        <h6 className="text-white mb-3">Developed By</h6>
                        <ul className="list-unstyled text-white-50 small">
                            <li className="mb-1">Nitin Pathekar (0108IT221036)</li>
                            <li className="mb-1">Samar Shrivastava (0108IT221050)</li>
                            <li className="mb-1">Gaurav Parihar (0108IT221020)</li>
                            <li className="mb-1">Sambhav Jain (0108IT221051)</li>
                            <li className="mb-1">Harsh Indurkar (0108IT221022)</li>
                        </ul>
                    </div>
                </div>

                <hr className="my-4 border-secondary" />

                {/* Bottom Bar */}
                <div className="row align-items-center">
                    <div className="col-md-6 text-center text-md-start">
                        <p className="mb-0 text-white-50 small">
                            &copy; {new Date().getFullYear()} Student Discussion Forum. All rights reserved.
                        </p>
                    </div>
                    <div className="col-md-6 text-center text-md-end mt-3 mt-md-0">
                        <ul className="list-inline mb-0">
                            <li className="list-inline-item"><a href="#" className="text-white-50 small text-decoration-none">Privacy Policy</a></li>
                            <li className="list-inline-item mx-2 text-white-50">&middot;</li>
                            <li className="list-inline-item"><a href="#" className="text-white-50 small text-decoration-none">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <style>
                {`
                    .hover-text-white:hover {
                        color: #fff !important;
                        transition: color 0.3s ease;
                    }
                `}
            </style>
        </footer>
    );
};

export default Footer;
