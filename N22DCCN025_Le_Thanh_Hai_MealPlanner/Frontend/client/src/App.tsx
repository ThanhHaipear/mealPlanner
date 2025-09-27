import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Stats from "./pages/Stats";

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-gray-100">
                <nav className="bg-blue-600 text-white p-4 flex justify-between">
                    <h1 className="font-bold">🍽️ MealPlanner</h1>
                    <div className="space-x-4">
                        <Link to="/" className="hover:underline">Trang chủ</Link>
                        <Link to="/stats" className="hover:underline">Thống kê</Link>
                    </div>
                </nav>

                <div className="p-6">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/stats" element={<Stats />} />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;
