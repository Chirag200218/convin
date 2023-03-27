import '@/styles/globals.css'
import Home from '../Component/HomePage/Home'
import { store } from '../redux/store'
import { Provider } from 'react-redux'
export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
       <Home/>
    </Provider>
    
  )
}
