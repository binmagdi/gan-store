import CategoriesHeader from '@/components/store/layout/categories-header/CategoriesHeader'
import Footer from '@/components/store/layout/footer/Footer'
import Header from '@/components/store/layout/header/Header'
import  { ReactNode } from 'react'

import {Toaster} from "react-hot-toast"

export default function StoreLayout({children} : {children: ReactNode}) {
  return (
    <div>
        <Header />
        <CategoriesHeader />
        <div>{children}</div>
        <Footer />
        <Toaster position='top-center' />
    </div>
  )
}
