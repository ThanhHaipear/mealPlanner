import { useEffect, useState } from "react";
import { getStats } from "../api"; // Hàm gọi API

// Types
interface StatData {
    _id: string;
    totalCalories: number;
}

function Stats() {
    const [stats, setStats] = useState<StatData[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4; // Giảm xuống 4 để dễ quan sát hơn

    // Gọi API để lấy dữ liệu
    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const data = await getStats();
                setStats(data || []);
            } catch (err) {
                console.error("Lỗi khi lấy dữ liệu:", err);
                setStats([]);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    // Format lại ngày từ chuỗi "YYYY-MM-DD"
    const formatStatDate = (dateString: string): string => {
        if (!dateString) return "N/A";
        const parts = dateString.split("-");
        if (parts.length !== 3) return "N/A";
        const [year, month, day] = parts;
        const d = new Date(Number(year), Number(month) - 1, Number(day));
        if (isNaN(d.getTime())) return "N/A";
        return d.toLocaleDateString("vi-VN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    // Tính tổng calo và số ngày
    const totalCalories = stats.reduce((sum, s) => sum + s.totalCalories, 0);
    const totalDays = stats.length;
    const avgCaloriesPerDay = totalDays > 0 ? Math.round(totalCalories / totalDays) : 0;

    // Tìm ngày cao nhất và thấp nhất
    const maxCaloriesDay = stats.reduce(
        (max, current) => (current.totalCalories > max.totalCalories ? current : max),
        stats[0] || { totalCalories: 0, _id: "" }
    );
    const minCaloriesDay = stats.reduce(
        (min, current) => (current.totalCalories < min.totalCalories ? current : min),
        stats[0] || { totalCalories: 0, _id: "" }
    );

    // Function để lấy màu dựa trên số calo
    const getCaloriesColor = (calories: number): string => {
        if (calories >= 2500) return "text-red-600";
        if (calories >= 2000) return "text-orange-600";
        if (calories >= 1500) return "text-yellow-600";
        if (calories >= 1000) return "text-green-600";
        return "text-blue-600";
    };

    // Function để lấy icon dựa trên số calo
    const getCaloriesIcon = (calories: number): string => {
        if (calories >= 2500) return "🔥";
        if (calories >= 2000) return "⚡";
        if (calories >= 1500) return "💪";
        if (calories >= 1000) return "✅";
        return "💙";
    };

    // Function để lấy background color cho card
    const getCardBackground = (calories: number): string => {
        if (calories >= 2500) return "bg-gradient-to-r from-red-50 to-red-100";
        if (calories >= 2000) return "bg-gradient-to-r from-orange-50 to-orange-100";
        if (calories >= 1500) return "bg-gradient-to-r from-yellow-50 to-yellow-100";
        if (calories >= 1000) return "bg-gradient-to-r from-green-50 to-green-100";
        return "bg-gradient-to-r from-blue-50 to-blue-100";
    };

    // Tính toán phân trang
    const totalPages = Math.ceil(stats.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentStats = stats.slice(startIndex, endIndex);

    const goToPage = (page: number): void => {
        setCurrentPage(page);
    };

    const goToPreviousPage = (): void => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goToNextPage = (): void => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                        <div className="animate-pulse">
                            <div className="h-8 bg-gray-300 rounded w-1/3 mb-6"></div>
                            <div className="space-y-4">
                                <div className="h-20 bg-gray-300 rounded"></div>
                                <div className="h-16 bg-gray-300 rounded"></div>
                                <div className="h-16 bg-gray-300 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">
                        📊 Thống kê Calo theo ngày
                    </h1>
                    <p className="text-gray-600 text-lg">Theo dõi lượng calo tiêu thụ hàng ngày</p>
                </div>

                {stats.length > 0 ? (
                    <>
                        {/* Thống kê tổng quan - Layout 2x2 */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
                                <div className="text-3xl mb-2">📅</div>
                                <p className="text-sm font-medium text-gray-600 mb-1">Tổng ngày</p>
                                <p className="text-3xl font-bold text-blue-600">{totalDays}</p>
                            </div>
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
                                <div className="text-3xl mb-2">🍽️</div>
                                <p className="text-sm font-medium text-gray-600 mb-1">Tổng calo</p>
                                <p className="text-2xl font-bold text-red-600">{totalCalories.toLocaleString()}</p>
                            </div>
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
                                <div className="text-3xl mb-2">📈</div>
                                <p className="text-sm font-medium text-gray-600 mb-1">TB/ngày</p>
                                <p className="text-3xl font-bold text-green-600">{avgCaloriesPerDay.toLocaleString()}</p>
                            </div>
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
                                <div className="text-3xl mb-2">🏆</div>
                                <p className="text-sm font-medium text-gray-600 mb-1">Cao nhất</p>
                                <p className="text-2xl font-bold text-purple-600">{maxCaloriesDay.totalCalories.toLocaleString()}</p>
                            </div>
                        </div>

                        {/* Danh sách chi tiết theo ngày - Layout card */}
                        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">Chi tiết theo ngày</h2>
                                <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                                    Trang {currentPage} / {totalPages} • Tổng: {stats.length} ngày
                                </div>
                            </div>

                            {/* Grid layout cho cards */}
                            <div className="grid md:grid-cols-2 gap-6">
                                {currentStats.map((s: StatData, index: number) => {
                                    const originalIndex = startIndex + index;
                                    const isHighest = s.totalCalories === maxCaloriesDay.totalCalories;
                                    const isLowest = s.totalCalories === minCaloriesDay.totalCalories && stats.length > 1;

                                    return (
                                        <div
                                            key={s._id}
                                            className={`p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-xl hover:scale-105 ${isHighest
                                                ? "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300 shadow-lg"
                                                : isLowest
                                                    ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300 shadow-lg"
                                                    : `${getCardBackground(s.totalCalories)} border-gray-200`
                                                }`}
                                        >
                                            {/* Header của card */}
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-4xl">{getCaloriesIcon(s.totalCalories)}</span>
                                                        <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full mt-1">
                                                            #{originalIndex + 1}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    {isHighest && (
                                                        <div className="text-xs text-yellow-600 font-bold bg-yellow-100 px-2 py-1 rounded-full mb-1">
                                                            🏆 Cao nhất
                                                        </div>
                                                    )}
                                                    {isLowest && stats.length > 1 && (
                                                        <div className="text-xs text-blue-600 font-bold bg-blue-100 px-2 py-1 rounded-full mb-1">
                                                            💙 Thấp nhất
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Ngày */}
                                            <div className="mb-4">
                                                <h3 className="text-lg font-bold text-gray-800 leading-tight">
                                                    {formatStatDate(s._id)}
                                                </h3>
                                            </div>

                                            {/* Calories */}
                                            <div className="text-center">
                                                <div className="bg-white rounded-xl p-4 shadow-sm">
                                                    <span className={`text-3xl font-bold ${getCaloriesColor(s.totalCalories)}`}>
                                                        {s.totalCalories.toLocaleString()}
                                                    </span>
                                                    <span className="text-lg text-gray-500 ml-2">cal</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Phân trang */}
                            {totalPages > 1 && (
                                <div className="mt-8 flex justify-center items-center space-x-2">
                                    {/* Nút Previous */}
                                    <button
                                        onClick={goToPreviousPage}
                                        disabled={currentPage === 1}
                                        className={`px-6 py-3 rounded-xl border-2 transition-colors font-medium ${currentPage === 1
                                            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300'
                                            }`}
                                    >
                                        ‹ Trước
                                    </button>

                                    {/* Các nút số trang */}
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => goToPage(page)}
                                            className={`px-4 py-3 rounded-xl border-2 transition-colors font-medium ${page === currentPage
                                                ? 'bg-blue-500 text-white border-blue-500 shadow-lg'
                                                : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    {/* Nút Next */}
                                    <button
                                        onClick={goToNextPage}
                                        disabled={currentPage === totalPages}
                                        className={`px-6 py-3 rounded-xl border-2 transition-colors font-medium ${currentPage === totalPages
                                            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300'
                                            }`}
                                    >
                                        Sau ›
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="bg-white rounded-3xl shadow-xl p-12 border border-gray-100 text-center">
                        <div className="text-8xl mb-6">📊</div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Chưa có dữ liệu thống kê</h2>
                        <p className="text-gray-600 text-lg">Hãy thêm một số bữa ăn để xem thống kê calo theo ngày</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Stats;
