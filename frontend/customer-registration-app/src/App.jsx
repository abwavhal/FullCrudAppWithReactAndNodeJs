import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CustomerForm from './components/CustomerForm';
import CustomerList from './components/CustomerList';
import EditCustomer from './components/EditCustomer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CustomerForm />} />
        <Route path="/customers" element={<CustomerList />} />
        <Route path="/edit/:id" element={<EditCustomer />} />
      </Routes>
    </Router>
  );
}


export default App;

