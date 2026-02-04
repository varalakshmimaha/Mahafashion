

const SortDropdown = () => {
    return (
        <div className="flex items-center">
            <label htmlFor="sort" className="mr-2 text-sm font-medium text-gray-700">Sort by:</label>
            <select id="sort" className="border-gray-300 rounded-md shadow-sm">
                <option value="newest">Newest</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="popularity">Popularity</option>
            </select>
        </div>
    );
};

export default SortDropdown;
