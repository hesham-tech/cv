// plugins/vuetify.js

// Styles
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';

// Composables
import { createVuetify } from 'vuetify';

// Default theme configuration
const defaultTheme = localStorage.defaultTheme ? localStorage.defaultTheme : 'light';

export default createVuetify({
  theme: {
    defaultTheme,
    themes: {
      light: {
        colors: {
          background: '#f8fafc',
          surface: '#ffffff',
          primary: '#0F172A', // Navy
          secondary: '#C6A87C', // Gold
          error: '#ef4444',
          info: '#3b82f6',
          success: '#22c55e',
          warning: '#f59e0b',
        },
        variables: {
          'v-table-header-height': '40px',
          'v-table-row-height': '30px',
          'font-family': "'Inter', 'Cairo', sans-serif",
        },
      },
      dark: {
        dark: true,
        colors: {
          background: '#0F172A', // Dark Navy
          surface: '#1E293B', // Slate
          primary: '#ffffff',
          secondary: '#C6A87C', // Gold
          error: '#ef4444',
          info: '#3b82f6',
          success: '#22c55e',
          warning: '#f59e0b',
        },
        variables: {
          'v-table-header-height': '40px',
          'v-table-row-height': '30px',
          'font-family': "'Inter', 'Cairo', sans-serif",
        },
      },
    },
  },
  defaults: {
    global: {
      fontFamily: "'Inter', 'Cairo', sans-serif",
    },
    VBtn: {
      variant: 'flat',
      height: 44,
      rounded: 'lg',
      style: { textTransform: 'none', letterSpacing: '0.5px' },
    },
    VCard: {
      elevation: 0,
      rounded: 'lg',
      border: true,
    },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable',
      color: 'primary',
    },
  },
});
