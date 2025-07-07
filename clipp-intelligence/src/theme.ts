import { createTheme } from '@mantine/core';

export const theme = createTheme({
<<<<<<< HEAD
  primaryColor: 'blue',
=======
  primaryColor: 'orange',
  defaultRadius: 'md',
>>>>>>> 14fe689 (feat(theme): update to ClippIntell dark theme colors and add official logo)
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
  headings: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
  },
  colors: {
<<<<<<< HEAD
    dark: [
      '#C1C2C5',
      '#A6A7AB',
      '#909296',
      '#5c5f66',
      '#373A40',
      '#2C2E33',
      '#25262b',
      '#1A1B1E',
      '#141517',
      '#101113',
=======
    // Custom palette for ClippIntell
    orange: [
      '#FFECE6', '#FFD1C2', '#FFB399', '#FF8A66', '#FF6233', '#F5422E', '#D93B29', '#B93223', '#99291D', '#7A2017'
>>>>>>> 14fe689 (feat(theme): update to ClippIntell dark theme colors and add official logo)
    ],
    teal: [
      '#E6FAF9', '#C2F0EE', '#99E5E2', '#66D9D5', '#33CDC8', '#36A4A0', '#2E8C89', '#267472', '#1E5C5B', '#164443'
    ],
    white: [
      '#F1F0F1', '#F1F0F1', '#F1F0F1', '#F1F0F1', '#F1F0F1', '#F1F0F1', '#F1F0F1', '#F1F0F1', '#F1F0F1', '#F1F0F1'
    ],
    dark: [
      '#C1C2C5', '#A6A7AB', '#909296', '#5c5f66', '#373A40', '#23262B', '#1A1B1E', '#181A1B', '#141517', '#101113'
    ],
    // Add a custom background gradient for the app shell
    background: [
      '#181A1B', '#23262B', '#23262B', '#23262B', '#23262B', '#23262B', '#23262B', '#23262B', '#23262B', '#23262B'
    ]
  },
  components: {
    AppShell: {
      styles: {
        main: {
          background: 'linear-gradient(135deg, #23262B 0%, #181A1B 100%)',
        },
      },
    },
    Button: {
      defaultProps: {
        fw: 600,
      },
    },
    Card: {
      defaultProps: {
        shadow: 'md',
        radius: 'md',
      },
    },
    Paper: {
      defaultProps: {
        shadow: 'sm',
        radius: 'md',
      },
    },
  },
});
