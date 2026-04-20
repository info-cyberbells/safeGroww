import { Routes, Route } from 'react-router-dom'
import BrokerLogin from "./pages/Broken-Login/BrokerLogin.tsx";
import NotFound from "./pages/404Page/NotFound.tsx";
import LivePrice from "./pages/LivePrice.tsx";
import HistoricalChart from "./pages/HistoricalChart.tsx";



function App() {
  return (
    <Routes>
      <Route path="*" element={<NotFound />} />
      <Route path="/" element={<BrokerLogin />} />
      <Route path="/live-price" element={<LivePrice />} />
      <Route path="/his-price" element={<HistoricalChart />} />
      {/* future routes add here */}
      {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      {/* <Route path="/market" element={<Market />} /> */}
    </Routes>
  )
}

export default App