
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
				border: '#D0A676',
				input: '#8B5E34',
				ring: '#D0A676',
				background: '#FFFFFF',
				foreground: '#2C1810',
				primary: {
					DEFAULT: '#8B5E34',
					foreground: '#FFFFFF'
				},
				secondary: {
					DEFAULT: '#F4EBE2', 
					foreground: '#8B5E34'
				},
				destructive: {
					DEFAULT: '#C25450',
					foreground: '#FFFFFF'
				},
				muted: {
					DEFAULT: '#F4EBE2', 
					foreground: '#8B5E34'
				},
				accent: {
					DEFAULT: '#D0A676', 
					foreground: '#2C1810'
				},
				popover: {
					DEFAULT: '#FFFFFF',
					foreground: '#2C1810'
				},
				card: {
					DEFAULT: '#FFFFFF',
					foreground: '#2C1810'
				},
				sidebar: {
					DEFAULT: '#2C1810',
					foreground: '#F4EBE2',
					primary: '#D0A676',
					'primary-foreground': '#2C1810',
					accent: '#F4EBE2',
					'accent-foreground': '#2C1810',
					border: '#D0A676',
					ring: '#D0A676'
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
				'card-hover': '0 15px 30px -10px rgba(208, 166, 118, 0.1), 0 8px 10px -5px rgba(208, 166, 118, 0.04)',
				'elevation-1': '0 1px 3px rgba(139, 94, 52, 0.12), 0 1px 2px rgba(139, 94, 52, 0.24)',
				'elevation-2': '0 3px 6px rgba(139, 94, 52, 0.16), 0 3px 6px rgba(139, 94, 52, 0.23)',
				'elevation-3': '0 10px 20px rgba(139, 94, 52, 0.19), 0 6px 6px rgba(139, 94, 52, 0.23)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
