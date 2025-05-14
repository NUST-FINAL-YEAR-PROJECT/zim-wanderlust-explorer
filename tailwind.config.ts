
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
				border: '#36B5FF',
				input: '#5E35B1',
				ring: '#36B5FF',
				background: '#FFFFFF',
				foreground: '#333333',
				primary: {
					DEFAULT: '#5E35B1',
					foreground: '#FFFFFF'
				},
				secondary: {
					DEFAULT: '#F1F7FF', 
					foreground: '#5E35B1'
				},
				destructive: {
					DEFAULT: '#FF4A6D',
					foreground: '#FFFFFF'
				},
				muted: {
					DEFAULT: '#F1F7FF', 
					foreground: '#5E35B1'
				},
				accent: {
					DEFAULT: '#36B5FF', 
					foreground: '#FFFFFF'
				},
				popover: {
					DEFAULT: '#FFFFFF',
					foreground: '#333333'
				},
				card: {
					DEFAULT: '#FFFFFF',
					foreground: '#333333'
				},
				sidebar: {
					DEFAULT: '#5E35B1',
					foreground: '#FFFFFF',
					primary: '#36B5FF',
					'primary-foreground': '#FFFFFF',
					accent: '#F1F7FF',
					'accent-foreground': '#5E35B1',
					border: '#7D5DCE',
					ring: '#36B5FF'
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
				'card-hover': '0 15px 30px -10px rgba(54, 181, 255, 0.15), 0 8px 10px -5px rgba(54, 181, 255, 0.08)',
				'elevation-1': '0 1px 3px rgba(94, 53, 177, 0.12), 0 1px 2px rgba(94, 53, 177, 0.24)',
				'elevation-2': '0 3px 6px rgba(94, 53, 177, 0.16), 0 3px 6px rgba(94, 53, 177, 0.23)',
				'elevation-3': '0 10px 20px rgba(94, 53, 177, 0.19), 0 6px 6px rgba(94, 53, 177, 0.23)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
