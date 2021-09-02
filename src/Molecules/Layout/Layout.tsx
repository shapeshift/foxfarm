import React from 'react'
import { CopyRight } from './components/CopyRight'
import { Footer } from './components/Footer/Footer'
import { Header } from './components/Header/Header'

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
      <CopyRight />
      <style>
        {`
          .chakra-modal__content-container {
            z-index: 1 !important;
          }
          .bn-onboard-custom.bn-onboard-modal {
            z-index: 2; 
          }
        `}
      </style>
    </>
  )
}
