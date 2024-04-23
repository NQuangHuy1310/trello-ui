import CssBaseline from '@mui/material/CssBaseline'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '~/App.jsx'
import theme from '~/theme'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Cấu hình MUI Dialog
import { ConfirmProvider } from 'material-ui-confirm'

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<CssVarsProvider theme={theme}>
			<ConfirmProvider
				defaultOptions={{
					allowClose: false,
					dialogProps: { maxWidth: 'xs' },
					confirmationButtonProps: { color: 'secondary', variant: 'outlined' },
					cancellationButtonProps: { color: 'inherit' }
				}}
			>
				<CssBaseline />
				<App />
				<ToastContainer
					position="top-right"
					autoClose={5000}
					hideProgressBar={false}
					newestOnTop={false}
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
					theme="light"
				/>
			</ConfirmProvider>
		</CssVarsProvider>
	</React.StrictMode>
)
