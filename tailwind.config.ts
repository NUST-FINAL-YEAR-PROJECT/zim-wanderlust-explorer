
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: '#E2E8F0',
				input: '#6366F1',
				ring: '#8B5CF6',
				background: '#F1F0FB',
				foreground: '#1E293B',
				primary: {
					DEFAULT: '#6366F1',
					foreground: '#FFFFFF'
				},
				secondary: {
					DEFAULT: '#8B5CF6', 
					foreground: '#FFFFFF'
				},
				destructive: {
					DEFAULT: '#FF4A6D',
					foreground: '#FFFFFF'
				},
				muted: {
					DEFAULT: '#F1F5F9', 
					foreground: '#64748B'
				},
				accent: {
					DEFAULT: '#8B5CF6', 
					foreground: '#FFFFFF'
				},
				popover: {
					DEFAULT: '#FFFFFF',
					foreground: '#1E293B'
				},
				card: {
					DEFAULT: '#FFFFFF',
					foreground: '#1E293B'
				},
				sidebar: {
					DEFAULT: '#6366F1',
					foreground: '#FFFFFF',
					primary: '#8B5CF6',
					'primary-foreground': '#FFFFFF',
					accent: '#F1F0FB',
					'accent-foreground': '#6366F1',
					border: '#818CF8',
					ring: '#8B5CF6'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'fade-out': {
					'0%': {
						opacity: '1',
						transform: 'translateY(0)'
					},
					'100%': {
						opacity: '0',
						transform: 'translateY(10px)'
					}
				},
				'float': {
					'0%, 100%': {
						transform: 'translateY(0)'
					},
					'50%': {
						transform: 'translateY(-10px)'
					}
				},
				'pulse-soft': {
					'0%, 100%': {
						opacity: '1'
					},
					'50%': {
						opacity: '0.7'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'fade-out': 'fade-out 0.3s ease-out',
				'float': 'float 3s ease-in-out infinite',
				'pulse-soft': 'pulse-soft 2s ease-in-out infinite'
			},
			boxShadow: {
				'card-hover': '0 15px 30px -10px rgba(99, 102, 241, 0.15), 0 8px 10px -5px rgba(99, 102, 241, 0.08)',
				'elevation-1': '0 1px 3px rgba(99, 102, 241, 0.12), 0 1px 2px rgba(99, 102, 241, 0.24)',
				'elevation-2': '0 3px 6px rgba(99, 102, 241, 0.16), 0 3px 6px rgba(99, 102, 241, 0.23)',
				'elevation-3': '0 10px 20px rgba(99, 102, 241, 0.19), 0 6px 6px rgba(99, 102, 241, 0.23)',
			},
			fontFamily: {
				'display': ['Montserrat', 'sans-serif'],
				'body': ['Open Sans', 'sans-serif'],
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
