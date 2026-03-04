// =============================================
// Home Page - Landing page
// =============================================

import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
    const { user, isAdmin } = useAuth();

    return (
        <div className="min-h-[calc(100vh-64px)]">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Background gradient orbs */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
                    <div className="text-center">
                        <div className="mb-6">
                            <span className="inline-block bg-cyan-500/10 text-cyan-400 text-sm font-medium px-4 py-1.5 rounded-full border border-cyan-500/20">
                                🚗 Premium Vehicle Rental
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                            Rent Your Dream
                            <br />
                            <span className="gradient-text">Vehicle Today</span>
                        </h1>

                        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
                            Experience the freedom of the open road with Rentit. Choose from our
                            wide selection of premium vehicles at unbeatable prices.
                        </p>

                        <div className="flex items-center justify-center gap-4">
                            {user ? (
                                <Link
                                    to={isAdmin ? '/admin' : '/dashboard'}
                                    className="bg-gradient-to-r from-cyan-500 to-violet-500 text-white px-8 py-3.5 rounded-xl font-semibold text-lg hover:opacity-90 transition-all hover:shadow-lg hover:shadow-cyan-500/25"
                                >
                                    Go to Dashboard →
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        to="/register"
                                        className="bg-gradient-to-r from-cyan-500 to-violet-500 text-white px-8 py-3.5 rounded-xl font-semibold text-lg hover:opacity-90 transition-all hover:shadow-lg hover:shadow-cyan-500/25"
                                    >
                                        Get Started
                                    </Link>
                                    <Link
                                        to="/login"
                                        className="bg-slate-800 text-slate-300 px-8 py-3.5 rounded-xl font-semibold text-lg hover:bg-slate-700 transition-all border border-slate-700"
                                    >
                                        Sign In
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Hero Car Image */}
                    <div className="mt-14 hero-image-wrapper image-overlay max-w-5xl mx-auto shadow-2xl shadow-cyan-500/10">
                        <img
                            src="/images/hero_car.png"
                            alt="Premium rental car"
                            className="w-full h-[350px] md:h-[450px]"
                        />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-slate-900/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        Why Choose <span className="gradient-text">Rentit</span>?
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: '🚘',
                                title: 'Wide Selection',
                                desc: 'Choose from sedans, SUVs, luxury cars, and more. We have the perfect vehicle for every occasion.',
                            },
                            {
                                icon: '💰',
                                title: 'Best Prices',
                                desc: 'Competitive daily rates with no hidden fees. Transparent pricing you can trust.',
                            },
                            {
                                icon: '🛡️',
                                title: 'Easy Booking',
                                desc: 'Book your vehicle in minutes. Simple process with instant confirmation.',
                            },
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="glass-card rounded-2xl p-8 hover-glow transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="text-4xl mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Fleet Showcase Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-3">
                            Our <span className="gradient-text">Fleet</span>
                        </h2>
                        <p className="text-slate-400 max-w-lg mx-auto">
                            From luxury sedans to powerful SUVs — find the perfect vehicle for any occasion
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { img: '/images/sedan_car.png', name: 'Luxury Sedans', desc: 'Elegant comfort for business & leisure' },
                            { img: '/images/suv_car.png', name: 'Premium SUVs', desc: 'Power & space for every adventure' },
                            { img: '/images/hero_car.png', name: 'Sports Cars', desc: 'Feel the thrill of the open road' },
                        ].map((car, index) => (
                            <div key={index} className="fleet-card glass-card">
                                <img src={car.img} alt={car.name} />
                                <div className="fleet-card-overlay">
                                    <h3 className="text-xl font-bold text-white mb-1">{car.name}</h3>
                                    <p className="text-slate-300 text-sm">{car.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-slate-900/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8 text-center">
                        {[
                            { value: '500+', label: 'Vehicles' },
                            { value: '10K+', label: 'Happy Customers' },
                            { value: '50+', label: 'Expert Drivers' },
                            { value: '24/7', label: 'Support' },
                        ].map((stat, index) => (
                            <div key={index}>
                                <div className="text-4xl font-bold gradient-text mb-2">{stat.value}</div>
                                <div className="text-slate-400">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-slate-800 py-8">
                <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <img src="/images/rentit_logo.png" alt="Rentit" className="w-6 h-6 rounded-md object-cover" />
                        <span className="font-semibold gradient-text">Rentit</span>
                    </div>
                    <p>© 2026 Rentit. All rights reserved. Built with ❤️</p>
                </div>
            </footer>
        </div>
    );
}
