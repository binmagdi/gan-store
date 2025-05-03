import CategoriesHeader from '@/components/store/layout/categories-header/CategoriesHeader'
import Footer from '@/components/store/layout/footer/Footer'
import Header from '@/components/store/layout/header/Header'
import  { ReactNode } from 'react'

export default function StoreLayout({children} : {children: ReactNode}) {
  return (
    <div>
        <Header />
        <CategoriesHeader />
        <div className='h-[1000px]'>{children}</div>
        <Footer />
    </div>
  )
}
