import CustomerChart from "./components/charts/customer-chart";
import CategoryColumnChart from "./components/charts/category-column-chart";
import DeliveryTimeBubbleMap from "./components/charts/bubble-map";

function App() {
  return (
    <div>
      <h1>E-commerce Analytics Dashboard</h1>
      <CustomerChart />
      <CategoryColumnChart />
      <DeliveryTimeBubbleMap />
    </div>
  )
}

export default App;