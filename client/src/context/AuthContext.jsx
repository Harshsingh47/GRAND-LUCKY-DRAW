import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [adminToken, setAdminToken] = useState(localStorage.getItem('gld_admin_token') || null);
  const [participant, setParticipant] = useState(null);
  const [participantToken, setParticipantToken] = useState(localStorage.getItem('gld_participant_token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize Admin profile if token exists
  useEffect(() => {
    const initAuth = async () => {
      if (adminToken) {
        try {
          const res = await api.get('/auth/admin/me');
          if (res.data.success) {
            setAdminUser(res.data.user);
          }
        } catch (err) {
          console.error('[Admin Auth Init Error]', err);
          logoutAdmin();
        }
      }

      if (participantToken) {
        try {
          const res = await api.get('/auth/participant/me');
          if (res.data.success) {
            setParticipant(res.data.participant);
          }
        } catch (err) {
          console.error('[Participant Auth Init Error]', err);
          logoutParticipant();
        }
      }

      setLoading(false);
    };

    initAuth();
  }, [adminToken, participantToken]);

  // Admin login
  const loginAdmin = (token, user) => {
    localStorage.setItem('gld_admin_token', token);
    setAdminToken(token);
    setAdminUser(user);
  };

  const logoutAdmin = () => {
    localStorage.removeItem('gld_admin_token');
    setAdminToken(null);
    setAdminUser(null);
  };

  // Participant login
  const loginParticipant = (token, participantData) => {
    localStorage.setItem('gld_participant_token', token);
    setParticipantToken(token);
    setParticipant(participantData);
  };

  const logoutParticipant = () => {
    localStorage.removeItem('gld_participant_token');
    setParticipantToken(null);
    setParticipant(null);
  };

  return (
    <AuthContext.Provider
      value={{
        adminUser,
        adminToken,
        isAdminLoggedIn: !!adminUser,
        loginAdmin,
        logoutAdmin,
        participant,
        participantToken,
        isParticipantLoggedIn: !!participant,
        loginParticipant,
        logoutParticipant,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
