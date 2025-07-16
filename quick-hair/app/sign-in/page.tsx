'use client'
import React, { useEffect, useState } from 'react';
import { Scissors, ChevronRight, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getSession, signIn } from 'next-auth/react';
import Link from 'next/link';
 

const SignInPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  async function myFunction() {
    const session = await getSession();
    if (session?.user?.role) {
      router.push(`/${session.user.role.toLowerCase()}`);
    }
  }

  useEffect(() => {
    myFunction();
    setTimeout(() => setShowAnimation(true), 100);
  }, []);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn('google');
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-700"></div>
        <div className="absolute bottom-20 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 opacity-30">
          <Scissors className="w-8 h-8 text-purple-400 animate-bounce" style={{ animationDelay: '0s' }} />
        </div>
        <div className="absolute top-1/3 right-1/3 opacity-30">
          <Sparkles className="w-6 h-6 text-pink-400 animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="absolute bottom-1/4 right-1/4 opacity-30">
          <Scissors className="w-10 h-10 text-blue-400 animate-bounce" style={{ animationDelay: '2s' }} />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen mt-10 max-md:mt-0 flex items-center justify-center px-6">
        <div className="max-w-md w-full">
          {/* Logo and Brand */}
          <div className={`text-center mb-12 transform transition-all duration-1000 ${showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <Link href={'/'} className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 max-md:mb-3 shadow-lg">
              <Scissors className="w-10 h-10 text-white" />
            </Link>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
              Sign-in
            </h1>
            <div className="text-2xl md:text-3xl font-semibold text-gray-300 mb-2">
              <span className="text-purple-400">No wait</span> && <span className="text-pink-400">haircut</span>
            </div>
            <p className="text-gray-400 text-lg">
              Welcome back to Quick Haircut
            </p>
          </div>

          {/* Sign In Card */}
          <div className={`bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 shadow-xl transform transition-all duration-1000 delay-300 ${showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-gray-300">Sign in to manage your appointments and find nearby salons</p>
            </div>

            {/* Google Sign In Button */}
            <button 
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl px-8 py-4 font-semibold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 text-lg"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Sign in with Google
                </>
              )}
            </button>

             

            {/* Features Preview */}
            <div className="mt-8 pt-6 border-t border-white/20">
              <p className="text-center text-gray-300 text-sm mb-4">What you'll get:</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-300">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  Real-time queue updates
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                  Appointment booking
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  Service history
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  Nearby salon finder
                </div>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          <div className={`text-center mt-8 transform transition-all duration-1000 delay-500 ${showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="flex justify-center gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-purple-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-purple-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-purple-400 transition-colors">Help</a>
            </div>
            <p className="mt-4 text-xs text-gray-500">
              © 2025 Quick Haircut. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Back to Home */}
      <div className="absolute top-6 left-6 z-20">
        <button 
          onClick={() => router.push('/')}
          className="bg-white/10 backdrop-blur-sm text-white rounded-full p-3 border border-white/20 shadow-lg hover:bg-white/20 transition-all transform hover:scale-105"
        >
          <ChevronRight className="w-5 h-5 rotate-180" />
        </button>
      </div>
    </div>
  );
};

export default SignInPage;