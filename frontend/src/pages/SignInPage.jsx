import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SignInPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleContinue = (e) => {
    e.preventDefault();
    if (!email) {
      setError('Enter your email or mobile phone number');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!password) {
      setError('Enter your password');
      setLoading(false);
      return;
    }

    // Mock sign in (simulating network delay)
    await new Promise(resolve => setTimeout(resolve, 500));

    const result = signIn(email, password);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError('Sign in failed. Please try again.');
    }
    setLoading(false);
  };

  const handleChangeEmail = () => {
    setStep(1);
    setPassword('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-white font-sans text-[#0f1111]" data-testid="signin-page">
      {/* Header with Logo */}
      <div className="mb-[14px] pt-[22px] pb-[18px]">
        <div className="flex justify-center">
          <Link to="/">
            <div className="flex items-center relative">
              <img
                src="/amazon_logo_dark.png"
                alt="Amazon"
                className="h-[31px] object-contain"
              />
              <span className="text-[#0f1111] text-[14px] -mt-1 ml-0.5 font-normal">.in</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[350px] mx-auto">

        {/* Card */}
        <div className="border border-[#ddd] rounded-[8px] p-[26px] pb-[20px] mb-[22px]">

          {step === 1 ? (
            <>
              <h1 className="text-[24px] font-normal mb-[10px] leading-[1.2]">Sign in or create account</h1>

              <h2 className="text-[13px] font-bold mb-[4px] pl-[2px] tracking-wide text-[#0f1111]">Enter mobile number or email</h2>

              <form onSubmit={handleContinue}>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-[31px] px-[7px] py-[3px] border border-[#a6a6a6] border-t-[#949494] rounded-[3px] text-[13px] shadow-[0_1px_0_rgba(255,255,255,0.5),0_1px_0_rgba(0,0,0,0.07)_inset] focus:outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] transition-all mb-[14px]"
                  autoFocus
                />

                {error && (
                  <div className="flex items-center gap-2 text-[#c40000] text-[12px] mb-[14px] pl-[2px]">
                    <AlertCircle className="w-[15px] h-[15px]" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full h-[29px] bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] rounded-[8px] text-[13px] text-[#0f1111] shadow-[0_2px_5px_0_rgba(213,217,217,0.5)] focus:ring-[3px] focus:ring-[#008296] focus:ring-opacity-50 cursor-pointer mb-[18px] font-normal"
                >
                  Continue
                </button>
              </form>

              <div className="text-[12px] leading-[1.5] mb-[22px]">
                By continuing, you agree to Amazon's <span className="text-[#007185]">Conditions of Use</span> and <span className="text-[#007185]">Privacy Notice</span>.
              </div>

              {/* Need help? and New to Amazon? sections are REMOVED as they are absent in the user screenshot */}

              <div className="border-t border-[#e7e7e7] pt-[14px]">
                <div className="text-[13px] font-bold mb-[4px]">Buying for work?</div>
                <span className="text-[13px] text-[#007185] block">
                  Create a free business account
                </span>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-[28px] font-normal mb-[10px] leading-[1.2]">Sign in</h1>

              <div className="flex items-center justify-between mb-[14px]">
                <span className="text-[13px]">{email}</span>
                <button onClick={handleChangeEmail} className="text-[13px] text-[#007185] hover:text-[#c7511f] hover:underline">Change</button>
              </div>

              {error && (
                <div className="flex items-start gap-3 p-[14px] mb-[14px] border border-[#c40000] rounded-[4px] shadow-[0_0_0_1px_#c40000_inset]">
                  <AlertCircle className="w-[18px] h-[18px] text-[#c40000] shrink-0" />
                  <div className="text-[12px]">
                    <h4 className="font-bold text-[#c40000] mb-1">There was a problem</h4>
                    <p>{error}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSignIn}>
                <div className="flex justify-between items-center mb-[5px]">
                  <label className="text-[13px] font-bold pl-[2px]">Password</label>
                  <span className="text-[13px] text-[#007185]">Forgot Password?</span>
                </div>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-[31px] px-[7px] py-[3px] border border-[#a6a6a6] border-t-[#949494] rounded-[3px] text-[13px] shadow-[0_1px_0_rgba(255,255,255,0.5),0_1px_0_rgba(0,0,0,0.07)_inset] focus:outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] transition-all mb-[14px]"
                  autoFocus
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-[29px] bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] rounded-[8px] text-[13px] text-[#0f1111] shadow-[0_2px_5px_0_rgba(213,217,217,0.5)] focus:ring-[3px] focus:ring-[#008296] focus:ring-opacity-50 cursor-pointer mb-[14px] font-normal"
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>

                <div className="flex items-center gap-[6px] mb-[22px]">
                  <input type="checkbox" className="w-[13px] h-[13px] border-[#a6a6a6] rounded-[2px] text-[#e77600] focus:ring-[#e77600] cursor-pointer shadow-[0_1px_0_rgba(255,255,255,0.5)_inset]" />
                  <span className="text-[13px]">Keep me signed in</span>
                </div>
              </form>
            </>
          )}

        </div>

        {/* Create Account Divider */}
        {step === 1 && (
          <div className="relative text-center mb-[26px]">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#e7e7e7]"></div></div>
            <span className="relative bg-white px-[8px] text-[12px] text-[#767676]">New to Amazon?</span>
            <div className="mt-[10px]">
              <Link to="/register" className="block w-full py-[6px] bg-white hover:bg-[#f7fafe] border border-[#d5d9d9] hover:border-[#d5d9d9] rounded-[8px] text-[13px] text-[#0f1111] shadow-[0_2px_5px_0_rgba(213,217,217,0.5)] hover:shadow-[0_2px_5px_0_rgba(213,217,217,0.5)] font-normal text-center">
                Create your Amazon account
              </Link>
            </div>
          </div>
        )}

      </div>

      {/* Footer */}
      <div className="mt-[26px] border-t border-[#e7e7e7] bg-gradient-to-b from-white to-[#fcfcfc] pb-[30px]">
        <div className="pt-[20px] max-w-[700px] mx-auto text-center px-4">
          <div className="flex flex-wrap justify-center gap-x-[26px] gap-y-2 text-[11px] text-[#007185] mb-[10px]">
            <span className="text-[#007185]">Conditions of Use</span>
            <span className="text-[#007185]">Privacy Notice</span>
            <span className="text-[#007185]">Help</span>
          </div>
          <div className="text-[11px] text-[#555]">
            © 1996-{new Date().getFullYear()}, Amazon.com, Inc. or its affiliates
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
