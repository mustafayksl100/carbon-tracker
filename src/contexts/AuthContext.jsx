import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import db, { dbHelpers } from '../db/database';

const AuthContext = createContext(null);

// Simple password hashing (for demo purposes - use bcrypt in production)
const hashPassword = async (password) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
};

const verifyPassword = async (password, hash) => {
    const passwordHash = await hashPassword(password);
    return passwordHash === hash;
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check for existing session on mount
    useEffect(() => {
        const checkSession = async () => {
            try {
                const storedUserId = localStorage.getItem('carbontrack_userId');
                if (storedUserId) {
                    const userData = await dbHelpers.getUserById(parseInt(storedUserId));
                    if (userData) {
                        setUser(userData);
                        const profileData = await dbHelpers.getProfileByUserId(userData.id);
                        setProfile(profileData);
                    } else {
                        localStorage.removeItem('carbontrack_userId');
                    }
                }
            } catch (err) {
                console.error('Session check error:', err);
            } finally {
                setLoading(false);
            }
        };

        checkSession();
    }, []);

    // Register new user
    const register = useCallback(async (email, password, username) => {
        setError(null);
        try {
            // Check if email already exists
            const existingUser = await dbHelpers.getUserByEmail(email);
            if (existingUser) {
                throw new Error('Bu e-posta adresi zaten kayıtlı');
            }

            // Hash password
            const passwordHash = await hashPassword(password);

            // Create user
            const userId = await dbHelpers.createUser({
                email,
                username,
                passwordHash,
                emailVerified: false,
                verificationToken: uuidv4(),
                profileImage: null,
                resetToken: null,
                resetTokenExpiry: null
            });

            // Get created user
            const userData = await dbHelpers.getUserById(userId);

            // Create empty profile
            await dbHelpers.createProfile({
                userId,
                fullName: '',
                birthDate: null,
                country: 'Türkiye',
                city: '',
                householdSize: 1,
                incomeLevel: 'medium'
            });

            // Auto-login after registration
            setUser(userData);
            localStorage.setItem('carbontrack_userId', userId.toString());

            return { success: true, userId };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        }
    }, []);

    // Login
    const login = useCallback(async (email, password, rememberMe = false) => {
        setError(null);
        try {
            const userData = await dbHelpers.getUserByEmail(email);

            if (!userData) {
                throw new Error('Kullanıcı bulunamadı');
            }

            const isValid = await verifyPassword(password, userData.passwordHash);

            if (!isValid) {
                throw new Error('Şifre yanlış');
            }

            setUser(userData);
            const profileData = await dbHelpers.getProfileByUserId(userData.id);
            setProfile(profileData);

            localStorage.setItem('carbontrack_userId', userData.id.toString());

            return { success: true };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        }
    }, []);

    // Logout
    const logout = useCallback(() => {
        setUser(null);
        setProfile(null);
        localStorage.removeItem('carbontrack_userId');
    }, []);

    // Request password reset
    const requestPasswordReset = useCallback(async (email) => {
        setError(null);
        try {
            const userData = await dbHelpers.getUserByEmail(email);

            if (!userData) {
                // Don't reveal if email exists
                return { success: true, message: 'Eğer hesap varsa, şifre sıfırlama bağlantısı gönderildi' };
            }

            const resetToken = uuidv4();
            const resetTokenExpiry = new Date(Date.now() + 3600000).toISOString(); // 1 hour

            await dbHelpers.updateUser(userData.id, {
                resetToken,
                resetTokenExpiry
            });

            // In real app, send email here
            console.log('Reset token (would be sent via email):', resetToken);

            return {
                success: true,
                message: 'Şifre sıfırlama bağlantısı gönderildi',
                // Only for demo - remove in production
                demoToken: resetToken
            };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        }
    }, []);

    // Reset password with token
    const resetPassword = useCallback(async (token, newPassword) => {
        setError(null);
        try {
            // Find user with this token
            const users = await db.users.toArray();
            const userData = users.find(u => u.resetToken === token);

            if (!userData) {
                throw new Error('Geçersiz veya süresi dolmuş bağlantı');
            }

            if (new Date(userData.resetTokenExpiry) < new Date()) {
                throw new Error('Şifre sıfırlama bağlantısının süresi dolmuş');
            }

            const passwordHash = await hashPassword(newPassword);

            await dbHelpers.updateUser(userData.id, {
                passwordHash,
                resetToken: null,
                resetTokenExpiry: null
            });

            return { success: true, message: 'Şifreniz başarıyla değiştirildi' };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        }
    }, []);

    // Update profile
    const updateProfile = useCallback(async (profileData) => {
        setError(null);
        try {
            if (!user) throw new Error('Oturum açmanız gerekiyor');

            await dbHelpers.updateProfile(user.id, profileData);
            const updatedProfile = await dbHelpers.getProfileByUserId(user.id);
            setProfile(updatedProfile);

            return { success: true };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        }
    }, [user]);

    // Update profile picture
    const updateProfilePicture = useCallback(async (base64Image) => {
        setError(null);
        try {
            if (!user) throw new Error('Oturum açmanız gerekiyor');

            await dbHelpers.updateUser(user.id, { profileImage: base64Image });
            const updatedUser = await dbHelpers.getUserById(user.id);
            setUser(updatedUser);

            return { success: true };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        }
    }, [user]);

    const value = {
        user,
        profile,
        loading,
        error,
        isAuthenticated: !!user,
        register,
        login,
        logout,
        requestPasswordReset,
        resetPassword,
        updateProfile,
        updateProfilePicture
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthContext;
