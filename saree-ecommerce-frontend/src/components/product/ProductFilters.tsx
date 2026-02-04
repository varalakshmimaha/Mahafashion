

const ProductFilters = () => {
    // Mock data for filters
    const fabrics = ['Banarasi Silk', 'Kanjeevaram', 'Chiffon', 'Cotton', 'Georgette'];
    const colors = ['Maroon', 'Gold', 'Navy Blue', 'Cream', 'Red', 'Green'];
    const occasions = ['Wedding', 'Festive', 'Casual', 'Daily Wear'];

    return (
        <div className="w-full">
            {/* Price Range Slider */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Price Range</h3>
                <input type="range" min="500" max="20000" className="w-full" />
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span>₹500</span>
                    <span>₹20,000</span>
                </div>
            </div>

            {/* Fabric Type Checkboxes */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Fabric</h3>
                <div className="space-y-2">
                    {fabrics.map((fabric, index) => (
                        <label key={index} className="flex items-center">
                            <input type="checkbox" className="h-4 w-4 text-maroon-600 border-gray-300 rounded" />
                            <span className="ml-3 text-sm text-gray-600">{fabric}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Color Swatches */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Color</h3>
                <div className="flex flex-wrap gap-2">
                    {colors.map((color, index) => (
                        <button key={index} className="w-8 h-8 rounded-full border" style={{ backgroundColor: color }} title={color}></button>
                    ))}
                </div>
            </div>

            {/* Occasion Dropdown */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Occasion</h3>
                <select className="w-full border-gray-300 rounded-md shadow-sm">
                    {occasions.map((occasion, index) => (
                        <option key={index}>{occasion}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default ProductFilters;
