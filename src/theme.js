import { experimental_extendTheme as extendTheme } from '@mui/material/styles'

// Create a theme instance.
const theme = extendTheme({
  trello: {
    appBarHeight:'58px',
    boardBarHeight:'55px'
  },
  colorSchemes: {
    light: {},
    dark: {}
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          '*::-webkit-scrollbar': {
            width:'8px',
            height:'8px'
          },
          '*::-webkit-scrollbar-thumb': {
            backgroundColor:'#dcdde1',
            borderRadius:'8px',
            transition:'hover 2s linear'
          },
          '*::-webkit-scrollbar-thumb:hover': {
            backgroundColor:'white',
            borderRadius:'8px'
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform:'capitalize',
          borderWidth: '0.5px',
          '&:hover': { borderWidth: '0.5px' }
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize:'0.875rem'
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontSize:'0.875rem',
          '& fieldset' : { borderWidth: '0.5px !important' },
          '&:hover fieldset' : { borderWidth: '1px !important' },
          '&.Mui-focused fieldset' : { borderWidth: '1px !important' }
        }
      }
    }
  }
  // ...other properties
})

export default theme