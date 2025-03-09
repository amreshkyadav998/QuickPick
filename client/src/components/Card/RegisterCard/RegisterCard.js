import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './RegisterCard.css';

const RegisterCard = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { firstName, lastName, email, password } = formData;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        
        // Basic validation
        if (!firstName || !lastName || !email || !password) {
            setError('Please fill in all fields');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        try {
            setLoading(true);
            setError('');
            
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to register account');
            }

            // Save user data and token to localStorage
            localStorage.setItem('userInfo', JSON.stringify(data));
            localStorage.setItem('token', data.token);
            
            // Redirect to home page or dashboard
            navigate('/');
            
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register__card__container">
            <div className="register__card">
                <div className="register__header">
                    <h1>Create Account</h1>
                </div>
                {error && <div className="error__message">{error}</div>}
                <form onSubmit={handleRegister}>
                    <div className="register__inputs">
                        <div className="fname__input__container reg__input__container">
                            <label className="fname__label input__label">First name</label>
                            <input
                                type="text"
                                className="fname__input register__input"
                                name="firstName"
                                value={firstName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="lname__input__container reg__input__container">
                            <label className="lname__label input__label">Last name</label>
                            <input
                                type="text"
                                className="lname__input register__input"
                                name="lastName"
                                value={lastName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="email__input__container reg__input__container">
                            <label className="email__label input__label">Email</label>
                            <input
                                type="email"
                                className="email__input register__input"
                                placeholder='example@gmail.com'
                                name="email"
                                value={email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="password__input__container reg__input__container">
                            <label className="password__label input__label">Password</label>
                            <input
                                type="password"
                                className="password__input register__input"
                                name="password"
                                value={password}
                                onChange={handleChange}
                                required
                                minLength="6"
                            />
                        </div>
                        <div className="register__button__container">
                            <button
                                type="submit"
                                className="register__button"
                                disabled={loading}
                            >
                                {loading ? 'CREATING ACCOUNT...' : 'Create Account'}
                            </button>
                        </div>
                    </div>
                </form>
                <div className="register__other__actions">
                    <div className="register__login__account">Already have account? <Link to="/account/login">Login</Link></div>
                </div>
            </div>
        </div>
    );
};

export default RegisterCard;