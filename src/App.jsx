import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import Main from './components/Main/Main'
import './App.css';
import './assets/scss/globals.scss'
import Modal from './components/Modal/Modal';
function App() {
  return (
    <div className="App">
      <Header />
      <Modal />
      <Main />
      <Footer />
    </div>
  );
}

export default App;
