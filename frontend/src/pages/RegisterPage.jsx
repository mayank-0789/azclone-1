import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const passwordRequirements = [
    { label: 'At least 6 characters', valid: password.length >= 6 },
    { label: 'Contains a number', valid: /\d/.test(password) },
    { label: 'Contains a letter', valid: /[a-zA-Z]/.test(password) },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Mock sign up
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const result = signUp(email, password, name);
    if (result.success) {
      navigate('/');
    } else {
      setError('Registration failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white" data-testid="register-page">
      {/* Header */}
      <div className="py-4 border-b border-gray-200">
        <div className="max-w-[350px] mx-auto">
          <Link to="/" className="flex justify-center">
            <span className="text-3xl font-bold text-[#0f1111]">
              amazon<span className="text-[#f08804]">.com</span>
            </span>
          </Link>
        </div>
      </div>

      {/* Registration Form */}
      <div className="max-w-[350px] mx-auto mt-6 px-4">
        <div className="border border-gray-300 rounded-lg p-5">
          <h1 className="text-2xl font-medium text-[#0f1111] mb-4">Create account</h1>

          {error && (
            <div 
              className="flex items-center gap-2 p-3 mb-4 bg-[#fcf4f4] border border-[#c40000] rounded-lg text-sm text-[#c40000]"
              data-testid="error-message"
            >
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label 
                htmlFor="name" 
                className="block text-sm font-bold text-[#0f1111] mb-1"
              >
                Your name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="First and last name"
                className="w-full px-3 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-[#e77600] focus:border-[#e77600]"
                data-testid="name-input"
              />
            </div>

            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-bold text-[#0f1111] mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-[#e77600] focus:border-[#e77600]"
                data-testid="email-input"
              />
            </div>

            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-bold text-[#0f1111] mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full px-3 py-2 pr-10 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-[#e77600] focus:border-[#e77600]"
                  data-testid="password-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Password Requirements */}
              {password && (
                <div className="mt-2 space-y-1">
                  {passwordRequirements.map((req, i) => (
                    <div 
                      key={i}
                      className={`flex items-center gap-2 text-xs ${req.valid ? 'text-green-600' : 'text-gray-500'}`}
                    >
                      {req.valid ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <div className="w-3 h-3 rounded-full border border-gray-400" />
                      )}
                      {req.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label 
                htmlFor="confirmPassword" 
                className="block text-sm font-bold text-[#0f1111] mb-1"
              >
                Re-enter password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-[#e77600] focus:border-[#e77600]"
                data-testid="confirm-password-input"
              />
              {confirmPassword && password !== confirmPassword && (
                <p className="mt-1 text-xs text-[#c40000]">Passwords must match</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-[#ffd814] hover:bg-[#f7ca00] rounded-lg text-sm font-medium text-[#0f1111] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="register-button"
            >
              {loading ? 'Creating account...' : 'Create your Amazon account'}
            </button>
          </form>

          <p className="mt-4 text-xs text-[#0f1111]">
            By creating an account, you agree to Amazon's{' '}
            <Link to="/conditions" className="text-[#007185] hover:text-[#c7511f] hover:underline">
              Conditions of Use
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-[#007185] hover:text-[#c7511f] hover:underline">
              Privacy Notice
            </Link>.
          </p>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-sm text-[#0f1111]">
              Already have an account?{' '}
              <Link 
                to="/signin" 
                className="text-[#007185] hover:text-[#c7511f] hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-gray-200 bg-gradient-to-b from-transparent to-gray-100">
        <div className="max-w-[600px] mx-auto text-center py-4">
          <div className="flex justify-center gap-4 text-xs text-[#007185] mb-2">
            <Link to="/conditions" className="hover:text-[#c7511f] hover:underline">
              Conditions of Use
            </Link>
            <Link to="/privacy" className="hover:text-[#c7511f] hover:underline">
              Privacy Notice
            </Link>
            <Link to="/help" className="hover:text-[#c7511f] hover:underline">
              Help
            </Link>
          </div>
          <p className="text-xs text-[#555]">
            © 1996-{new Date().getFullYear()}, Amazon.com, Inc. or its affiliates
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
