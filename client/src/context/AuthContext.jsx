import { useState } from 'react';
import api from '../utils/axios';
import { AuthContext } from './auth';
import { authStorage } from '../utils/storage';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => authStorage.getUser());

    const login = async (email, password) => {
        try {
            const { data } = await api.post('/auth/login', { email, password });
            setUser(data.user);
            authStorage.setUser(data.user);
            authStorage.setToken(data.user.token);
            return data.user;
        } catch (error) {
            if (error.response?.data?.needsVerification) throw error.response.data;
            throw error.response?.data?.message || 'Login failed';
        }
    };

    const register = async (username, email, password) => {
        try {
            const { data } = await api.post('/auth/register', { username, email, password });
            return data; // Returns { message, email }
        } catch (error) {
            throw error.response?.data?.message || 'Registration failed';
        }
    };

    const verifyOTP = async (email, otp) => {
        try {
            const { data } = await api.post('/auth/verify-otp', { email, otp });
            setUser(data.user);
            authStorage.setUser(data.user);
            authStorage.setToken(data.user.token);
            return data.user;
        } catch (error) {
            throw error.response?.data?.message || 'OTP verification failed';
        }
    };

    const logout = () => {
        setUser(null);
        authStorage.clearUser();
        authStorage.clearToken();
    };

    return (
        <AuthContext.Provider value={{ user, login, register, verifyOTP, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
