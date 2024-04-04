import Header from './header'
import Footer from './footer'

export default function Layout({ children }) {
  return (
    <>
      <Header heading='test' />
      <main>{children}</main>
      <Footer />
    </>
  )
}
