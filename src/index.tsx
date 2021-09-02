import React from 'react'
import ReactDOM from 'react-dom'
import App from 'pages/App'
import { theme } from 'lib/theme/theme'
import { BrowserRouter } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'
import reportWebVitals from 'reportWebVitals'

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider theme={theme} resetCSS>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log)
