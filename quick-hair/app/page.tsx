'use client';
import React, { useEffect } from 'react';
import { Scissors, MapPin, Clock, Users, TrendingUp, Calendar, Award, Sparkles } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CountUp from '@/components/ui/countup';
export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const role = session?.user.role?.toLowerCase();

  useEffect(() => {
    if (role) {
      router.push(`/${session?.user.role?.toLowerCase()}`)
    }
  }, [session]);
  const features = [
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Real-time Queue",
      description: "See your position in line and estimated wait time"
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Location-based",
      description: "Find nearby salons and barber shops instantly"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Service History",
      description: "Track your appointments and favorite services"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Analytics",
      description: "Barbers get insights on customer engagement"
    }
  ];

  const stats = [
    { number: 10,  symbol:'K+' , label: "Happy Customers" },
    { number: 500,  symbol:'+' , label: "Partner Salons" },
    { number: 50,  symbol:'K+' , label: "Appointments" },
    { number: 4.9, symbol:'★' ,  label: "Average Rating" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-700"></div>
        <div className="absolute bottom-20 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
      </div>

 <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/9 left-1/4 opacity-30">
          <Scissors className="w-8 h-8 text-purple-400 animate-bounce" style={{ animationDelay: '0s' }} />
        </div>
        <div className="absolute top-1/3 right-1/3 opacity-30">
          <Sparkles className="w-8 h-8 text-pink-400 animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="absolute bottom-1/2 left-1/9 opacity-30">
          <Sparkles className="w-10 h-10 text-pink-400 animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="absolute bottom-1/3 right-1/4 opacity-30">
          <Scissors className="w-10 h-10 text-blue-400 animate-bounce" style={{ animationDelay: '2s' }} />
        </div>
      </div>

      <header className="px-6 py-4 flex justify-between items-center backdrop-blur-sm bg-white/5 border-b border-white/10">
        <Link href={`/`} className="flex items-center space-x-2">
           <div className="w-9 h-9 max-md:w-8 max-md:h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Scissors className="w-6 h-6 text-white" />
            </div>
          <span className="text-2xl max-md:text-xl font-bold text-white">Quick Haircut</span>
        </Link>

        {!session ? <div className="flex space-x-4">
          <Link href={`/sign-in`} className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105">
            Sign Up
          </Link>
        </div> :
          <div className='text-white flex items-center space-x-4'>
            <div>Wellcome , 👋🏻 {session.user.name}</div>
            <img src={session.user.image!} alt="User Avatar" width={40} height={40} className='rounded-full' />
          </div>
        }
      </header>

      {!session && (
        <div className="relative z-10">
          <section className="px-6 py-20 text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Skip the <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Wait</span>,
                <br />
                Book Your <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Cut</span>
              </h1>
              <p className="text-[15px] text-gray-300 mb-8 max-w-2xl mx-auto">
                Revolutionary queue management for barbers and customers. Find nearby salons,
                track wait times, and manage your grooming experience like never before.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg">
                  <MapPin className="w-5 h-5 inline mr-2" />
                  Find Nearby Salons
                </button>
                <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/20">
                  <Calendar className="w-5 h-5 inline mr-2" />
                  Join Queue
                </button>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="px-6 py-16">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-4xl font-bold text-white mb-2">
                        <CountUp
                          from={0}
                          to={stat.number}
                          separator=","
                          direction="up"
                          duration={1}
                          className="count-up-text"
                        /> 
                      {stat.symbol}
                      </div>
                    <div className="text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="px-6 py-20">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-4xl font-bold text-white text-center mb-16">
                Why Choose <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Quick Haircut</span>?
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                  <div key={index} className="group">
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105">
                      <div className="text-purple-400 mb-4 group-hover:text-pink-400 transition-colors">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                      <p className="text-gray-400">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="px-6 py-20">
            <div className="max-w-4xl mx-auto text-center">
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-3xl p-12 border border-white/10">
                <h2 className="text-4xl max-md:text-3xl font-bold text-white mb-6">
                  Ready to Transform Your Salon Experience?
                </h2>
                <p className="text-lg max-md:text-base text-gray-300 mb-8">
                  Join thousands of satisfied customers and barbers who've revolutionized their grooming experience.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href={`/sign-in`} className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105">
                    Get Started as Customer
                  </Link>
                  <Link href={`/sign-in`}  className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/20">
                    Join as Barber
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {session && (
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-12 border border-white/10">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">
                Welcome Back, {session?.user?.name || 'User'}!
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                {role === 'user'
                  ? "Find your perfect salon,  Join Queue , and enjoy a seamless grooming experience!"
                  : "Manage your salon, track customer engagement, and grow your business!"
                }
              </p>
              <Link
                href={`/${role}`}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg"
              >
                <TrendingUp className="w-5 h-5 mr-2" />
                Go To Dashboard
              </Link>
              {role === 'user' && (
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all border border-white/20">
                    <MapPin className="w-5 h-5 inline mr-2" />
                    Find Nearby Salons
                  </button>
                  <button className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all border border-white/20">
                    <Clock className="w-5 h-5 inline mr-2" />
                    Join Queue
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 px-6 py-8 border-t border-white/10 backdrop-blur-sm bg-white/5">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Scissors className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Quick Haircut</span>
          </div>
          <p className="text-gray-400">
            © 2025 Quick Haircut. Revolutionizing the salon experience, one cut at a time.
          </p>
        </div>
      </footer>
    </div>
  );
}