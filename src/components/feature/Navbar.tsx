import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '@/components/base/Logo';

const navLinks = [
  { path: '/', label: 'Início', icon: 'ri-home-4-line' },
  { path: '/cursos', label: 'Cursos', icon: 'ri-graduation-cap-line' },
  { path: '/videoaulas', label: 'Vídeoaulas', icon: 'ri-video-line' },
  { path: '/gramatica', label: 'Gramática', icon: 'ri-book-open-line' },
  { path: '/exercicios', label: 'Exercícios', icon: 'ri-pencil-ruler-2-line' },
  { path: '/frases', label: 'Frases', icon: 'ri-chat-quote-line' },
  { path: '/flashcards', label: 'Flashcards', icon: 'ri-stack-line' },
  { path: '/dictionary', label: 'Glossário', icon: 'ri-translate-2' },
  { path: '/alphabet', label: 'Datilologia', icon: 'ri-keyboard-line' },
  { path: '/assistant', label: 'IA Assistente', icon: 'ri-sparkling-line' },
  { path: '/progress', label: 'Progresso', icon: 'ri-bar-chart-line' },
  { path: '/referencias', label: 'Referências', icon: 'ri-file-text-line' },
  { path: '/faq', label: 'FAQ', icon: 'ri-question-answer-line' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const location = useLocation();

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  React.useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isHome = location.pathname === '/';

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || !isHome
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 md:h-18 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1.5 group cursor-pointer">
            <div className="w-8 h-8 flex items-center justify-center">
              <i className={`ri-hand-heart-line text-xl ${scrolled || !isHome ? 'text-emerald-600' : 'text-white'}`}></i>
            </div>
            <Logo size={28} />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap cursor-pointer ${
                    active
                      ? 'bg-emerald-50 text-emerald-600'
                      : scrolled || !isHome
                      ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <i className={`${link.icon} text-base`}></i>
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* CTA Button */}
          <Link
            to="/dictionary"
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-emerald-200 hover:shadow-lg transition-all duration-200 cursor-pointer whitespace-nowrap"
          >
            <i className="ri-hand-heart-line"></i>
            Começar Agora
          </Link>

          {/* Mobile hamburger */}
          <button
            className={`md:hidden p-2 rounded-lg transition-colors cursor-pointer ${
              scrolled || !isHome ? 'text-slate-700 hover:bg-slate-100' : 'text-white hover:bg-white/10'
            }`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            <i className={`${mobileOpen ? 'ri-close-line' : 'ri-menu-line'} text-2xl`}></i>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute top-0 right-0 bottom-0 w-72 bg-white shadow-2xl flex flex-col pt-6 px-4 pb-8">
            {/* Header with logo + close */}
            <div className="flex items-center justify-between mb-4 px-3">
              <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-1.5 group cursor-pointer">
                <div className="w-8 h-8 flex items-center justify-center">
                  <i className="ri-hand-heart-line text-xl text-emerald-600"></i>
                </div>
                <Logo size={26} />
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Fechar menu"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3 px-3">
              Navegação
            </p>
            {navLinks.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 mb-1 cursor-pointer ${
                    active
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className={`w-8 h-8 flex items-center justify-center rounded-lg ${active ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                    <i className={`${link.icon} text-base`}></i>
                  </div>
                  {link.label}
                </Link>
              );
            })}
            <div className="mt-auto">
              <Link
                to="/dictionary"
                className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-sm font-semibold cursor-pointer whitespace-nowrap"
              >
                <i className="ri-hand-heart-line"></i>
                Começar Agora
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}