// client/src/Context/AuthContext.js
// import React, { createContext, useState, useEffect } from 'react';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         // Check if user is logged in on app load
//         const checkLoggedIn = async () => {
//             try {
//                 const userInfo = localStorage.getItem('userInfo');
//                 const token = localStorage.getItem('token');

//                 if (!userInfo || !token) {
//                     setIsAuthenticated(false);
//                     setUser(null);
//                     setLoading(false);
//                     return;
//                 }

//                 // Verify token is valid by fetching user profile
//                 const response = await fetch('http://localhost:5000/api/auth/profile', {
//                     method: 'GET',
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'Authorization': `Bearer ${token}`
//                     }
//                 });

//                 if (response.ok) {
//                     // Token is valid
//                     setUser(JSON.parse(userInfo));
//                     setIsAuthenticated(true);
//                 } else {
//                     // Token is invalid or expired
//                     localStorage.removeItem('userInfo');
//                     localStorage.removeItem('token');
//                     setIsAuthenticated(false);
//                     setUser(null);
//                 }
//             } catch (error) {
//                 console.error('Authentication error:', error);
//                 setIsAuthenticated(false);
//                 setUser(null);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         checkLoggedIn();
//     }, []);

//     // Login function
//     const login = (userData) => {
//         localStorage.setItem('userInfo', JSON.stringify(userData));
//         localStorage.setItem('token', userData.token);
//         setUser(userData);
//         setIsAuthenticated(true);
//     };

//     // Logout function
//     const logout = () => {
//         localStorage.removeItem('userInfo');
//         localStorage.removeItem('token');
//         setUser(null);
//         setIsAuthenticated(false);
//     };

//     return (
//         <AuthContext.Provider
//             value={{
//                 isAuthenticated,
//                 user,
//                 loading,
//                 login,
//                 logout
//             }}
//         >
//             {children}
//         </AuthContext.Provider>
//     );
// };