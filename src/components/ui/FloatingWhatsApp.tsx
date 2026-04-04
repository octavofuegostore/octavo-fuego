import { useState, useEffect } from 'react';

interface FloatingWhatsAppProps {
  phoneNumber?: string;
  defaultMessage?: string;
  position?: 'bottom-right' | 'bottom-left';
}

const FloatingWhatsApp = ({
  phoneNumber = '573001234567',
  defaultMessage = 'Hola, me interesa conocer más sobre Octavo Fuego',
  position = 'bottom-right'
}: FloatingWhatsAppProps) => {
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setShouldAnimate(true);
      setTimeout(() => setShouldAnimate(false), 1000);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

  const positionClasses = position === 'bottom-right' 
    ? 'right-6 bottom-6' 
    : 'left-6 bottom-6';

  return (
    <div className={`fixed ${positionClasses} z-[99999] font-sans`}>
      <a 
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center gap-3"
        aria-label="Contactar por WhatsApp"
      >
        {/* Tooltip */}
        <span className="absolute right-full mr-3 bg-black text-white text-sm px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap font-medium hidden md:block">
          ¿Necesitas ayuda?
        </span>

        {/* Botón WhatsApp */}
        <div 
          className={`
            w-14 h-14 rounded-full flex items-center justify-center 
            text-white text-2xl shadow-xl
            transition-all duration-300 hover:scale-110
            ${shouldAnimate ? 'animate-ring' : ''}
          `}
          style={{ 
            backgroundColor: '#25D366',
            boxShadow: '0 8px 30px rgba(37, 211, 102, 0.4)'
          }}
        >
          <i className="bi bi-whatsapp"></i>
        </div>
      </a>

      <style>{`
        @keyframes ring {
          0% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.15) rotate(-8deg); }
          50% { transform: scale(1.15) rotate(8deg); }
          75% { transform: scale(1.15) rotate(-8deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        
        .animate-ring {
          animation: ring 0.6s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default FloatingWhatsApp;
