import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { Sparkles, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export const Login = ({ navigateTo }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Navigation will be handled by App.jsx onAuthStateChanged
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password.');
      } else if (err.code === 'auth/network-request-failed') {
        setError('Network error. Please check your internet connection.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please try again later.');
      } else {
        setError('Failed to login. Please try again.');
      }
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (!email) {
      setError('Please enter your email address to reset password.');
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('A password reset link has been sent to your email.');
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (err.code === 'auth/network-request-failed') {
        setError('Network error. Please check your internet connection.');
      } else {
        setError('Failed to send reset email. Please try again.');
      }
    }
    setLoading(false);
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
        {/* Decorative element */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-vintage-rose via-vintage-gold to-vintage-sage"></div>
        
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="flex justify-center mb-4"
          >
            <div className="w-12 h-12 bg-vintage-charcoal rounded-full flex items-center justify-center">
              <Sparkles className="text-vintage-gold" size={24} />
            </div>
          </motion.div>
          <h1 className="text-4xl mb-2">Welcome Back</h1>
          <p className="text-vintage-charcoal/60">Enter the studio to continue your journey</p>
        </div>

        <div className="min-h-[300px]">
          <AnimatePresence mode="wait">
            {!isResettingPassword ? (
              <motion.form 
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleLogin} 
                className="space-y-6"
              >
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
                  label="Email Address" 
                  type="email" 
                  placeholder="editorial@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                
                <div className="space-y-1">
                  <Input 
                    label="Password" 
                    type="password" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <div className="flex justify-end">
                    <button 
                      type="button"
                      onClick={() => {
                        setIsResettingPassword(true);
                        setError('');
                        setMessage('');
                      }}
                      className="text-xs text-vintage-charcoal/60 hover:text-vintage-gold transition-colors mt-1"
                    >
                      Forgot Password?
                    </button>
                  </div>
                </div>
                
                <div className="pt-2">
                  <Button type="submit" className="w-full flex items-center justify-center gap-2" disabled={loading}>
                    {loading && <Loader2 size={16} className="animate-spin" />}
                    {loading ? 'Entering Studio...' : 'Sign In'}
                  </Button>
                </div>
              </motion.form>
            ) : (
              <motion.form 
                key="reset"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handlePasswordReset} 
                className="space-y-6"
              >
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
                {message && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="bg-green-50 text-green-700 p-3 rounded-lg flex items-center gap-2 text-sm"
                  >
                    <CheckCircle2 size={16} />
                    {message}
                  </motion.div>
                )}

                <Input 
                  label="Email Address" 
                  type="email" 
                  placeholder="editorial@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                
                <div className="pt-4 flex flex-col gap-3">
                  <Button type="submit" className="w-full flex items-center justify-center gap-2" disabled={loading}>
                    {loading && <Loader2 size={16} className="animate-spin" />}
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => {
                      setIsResettingPassword(false);
                      setError('');
                      setMessage('');
                    }}
                    className="w-full"
                    disabled={loading}
                  >
                    Back to Login
                  </Button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-vintage-charcoal/60">
            Don't have an account?{' '}
            <button 
              onClick={() => navigateTo('signup')}
              className="text-vintage-charcoal font-semibold hover:text-vintage-gold transition-colors"
            >
              Request Access
            </button>
          </p>
        </div>
      </div>
    </motion.div>
  );
};
