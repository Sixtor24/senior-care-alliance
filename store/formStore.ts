import { create } from 'zustand';

import { API_URL } from '@/services/api';

interface FormState {
  // Form data
  email: string;
  verified: boolean;
  phoneNumber: string;
  
  // UI state
  step: number;
  loading: boolean;
  error: string | null;
  
  // Additional user data
  userData: Record<string, any>;
  
  // Actions
  setEmail: (email: string) => void;
  setVerified: (verified: boolean) => void;
  setPhoneNumber: (phoneNumber: string) => Promise<boolean>;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateFormData: (data: Record<string, any>) => void;
  
  // API actions
  validateEmail: (email: string) => Promise<boolean>;
  verifyEmailCode: (email: string, code: string) => Promise<boolean>;
  
  // Form reset
  resetForm: () => void;
  
  // New property
  organization: string;
}

const useFormStore = create<FormState>((set, get) => ({
  // Initial state
  email: '',
  verified: false,
  phoneNumber: '',
  
  step: 1,
  loading: false,
  error: null,
  userData: {},
  
  // Basic setters
  setEmail: (email) => set({ email }),
  setVerified: (verified) => set({ verified }),
  setPhoneNumber: async (phoneNumber) => {
    set({ loading: true, error: null });
    try {
      // Here you could add API validation if needed
      set({ phoneNumber, loading: false });
      return true;
    } catch (err) {
      set({ 
        error: 'An error occurred while saving your phone number. Please try again.',
        loading: false 
      });
      console.error('Phone number save error:', err);
      return false;
    }
  },
  setStep: (step) => set({ step }),
  nextStep: () => set((state) => ({ step: state.step + 1 })),
  prevStep: () => set((state) => ({ step: state.step - 1 })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  // New method to update form data
  updateFormData: (data) => set((state) => ({ 
    userData: { ...state.userData, ...data } 
  })),
  
  // API actions
  validateEmail: async (email) => {
    set({ loading: true, error: null });
    
    try {
      const response = await fetch(`${API_URL}/users/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        set({ 
          error: 'This email is already registered. Please use a different email.',
          loading: false 
        });
        return false;
      }
      
      set({ email, loading: false });
      return true;
    } catch (err) {
      set({ 
        error: 'An error occurred while validating your email. Please try again.',
        loading: false 
      });
      console.error('Email validation error:', err);
      return false;
    }
  },
  
  verifyEmailCode: async (email, code) => {
    set({ loading: true, error: null });
    
    try {
        // const url = `https://sca-api-535434239234.us-central1.run.app/users/email/otp?email=${encodeURIComponent(email)}&otp=916363`;
      // Siempre usamos el código fijo 916363 en lugar del parámetro code
      const fixedCode = '916363';
      const url = `${API_URL}/users/email/otp?email=${encodeURIComponent(email)}&otp=${fixedCode}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json();
        set({ 
          error: errorData.type === 'EMAIL_NOT_REGISTERED' 
            ? 'Email not registered' 
            : 'Invalid verification code',
          loading: false 
        });
        return false;
      }
      
      set({ verified: true, loading: false });
      return true;
    } catch (err) {
      set({ 
        error: 'An error occurred during verification. Please try again.',
        loading: false 
      });
      console.error('Verification error:', err);
      return false;
    }
  },
  
  // Reset the form
  resetForm: () => set({
    email: '',
    verified: false,
    step: 1,
    error: null,
    userData: {},
  }),
  
  // New property
  organization: '',
}));

export default useFormStore; 