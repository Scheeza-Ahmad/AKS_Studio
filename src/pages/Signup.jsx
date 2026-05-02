import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';

export const Signup = ({ navigateTo }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Navigation is handled by App.jsx
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else if (err.code === 'auth/network-request-failed') {
        setError('Network error. Please check your internet connection.');
      } else {
        setError('Failed to create account. Please try again.');
      }
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen flex items-center justify-center p-4"
    >
      <div className="max-w-md w-full glass-panel p-10 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-vintage-sage via-vintage-gold to-vintage-rose"></div>
        
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="flex justify-center mb-4"
          >
            <div className="w-12 h-12 bg-vintage-charcoal rounded-full flex items-center justify-center">
              <Sparkles className="text-vintage-rose" size={24} />
            </div>
          </motion.div>
          <h1 className="text-4xl mb-2">Join the Studio</h1>
          <p className="text-vintage-charcoal/60">Begin your bespoke fashion experience</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="bg-red-50 text-red-500 p-3 rounded-lg flex items-center gap-2 text-sm"
            >
              <AlertCircle size={16} />
              {error}
            </motion.div>
          )}

          <Input 
            label="Full Name" 
            type="text" 
            placeholder="Jane Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input 
            label="Email Address" 
            type="email" 
            placeholder="editorial@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input 
            label="Password" 
            type="password" 
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          
          <div className="pt-4">
            <Button type="submit" className="w-full flex items-center justify-center gap-2" disabled={loading}>
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? 'Creating Profile...' : 'Sign Up'}
            </Button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-vintage-charcoal/60">
            Already a member?{' '}
            <button 
              onClick={() => navigateTo('login')}
              className="text-vintage-charcoal font-semibold hover:text-vintage-gold transition-colors"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </motion.div>
  );
};
