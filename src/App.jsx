import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import Main from './components/Main/Main'
import './App.css';
import './assets/scss/globals.scss'
import { ModalProvider } from './context/ModalContext';
import Modal from './components/Modal/Modal';
function App() {
  return (
    <ModalProvider>
    <Modal />
    <div className="App">
      <Header />
      <Main />
      <Footer />
    </div>
    </ModalProvider>
  );
}

export default App;
