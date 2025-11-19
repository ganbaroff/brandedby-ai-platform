/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/react-app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Enhanced Responsive Breakpoints
      screens: {
        'xs': '320px',    // Extra small devices
        'sm': '640px',    // Small devices
        'md': '768px',    // Medium devices  
        'lg': '1024px',   // Large devices
        'xl': '1280px',   // Extra large devices
        '2xl': '1536px',  // 2X Extra large devices
      },
      
      // Brand Colors
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe', 
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554'
        },
        secondary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff', 
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764'
        },
        accent: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63'
        }
      },
      
      // Typography
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Cal Sans', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace']
      },
      
      // Enhanced shadows with glows
      boxShadow: {
        'glow-sm': '0 0 10px rgb(59 130 246 / 0.3)',
        'glow': '0 0 20px rgb(59 130 246 / 0.5)',
        'glow-lg': '0 0 30px rgb(59 130 246 / 0.7)',
        'glow-purple': '0 0 20px rgb(168 85 247 / 0.5)',
        'glow-purple-lg': '0 0 30px rgb(168 85 247 / 0.7)',
      },
      
      // Custom animations
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out', 
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite'
      },
      
      // Keyframes for animations
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgb(59 130 246 / 0.3)' },
          '100%': { boxShadow: '0 0 30px rgb(59 130 246 / 0.8)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      },
      
      // Background gradients
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #3b82f6 0%, #a855f7 100%)',
        'gradient-brand-reverse': 'linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)',
        'gradient-sunset': 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
        'gradient-ocean': 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
        'gradient-success': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        'gradient-dark': 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
      }
    },
  },
  plugins: [],
};
