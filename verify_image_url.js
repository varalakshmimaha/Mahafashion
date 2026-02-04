
// Mock constants
const API_BASE_URL = 'http://127.0.0.1:8000/api';
const API_STORAGE_URL = 'http://127.0.0.1:8000/storage';
const placeholderSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='800' viewBox='0 0 600 800'><rect fill='#f3f4f6' width='100%' height='100%'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23cbd5e1' font-size='36' font-family='Arial, Helvetica, sans-serif'>Image</text></svg>`;
const PLACEHOLDER_DATA_URI = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(placeholderSvg)}`;

// The function to test (copied from the fix)
const getImageUrl = (item) => {
    // Handle cases where item itself is the product or contains product
    const prod = item?.product || item || {};

    // Collect all possible image sources
    const candidates = [
        item?.image,
        item?.imageUrl,
        item?.image_url,
        prod?.image,
        prod?.imageUrl,
        prod?.image_url
    ];

    if (prod.images && Array.isArray(prod.images) && prod.images.length > 0) {
        const img = prod.images[0];
        candidates.push(img?.image_url, img?.url, img?.path, img?.imageUrl);
    }

    // prefer absolute URL
    for (const c of candidates) {
        if (!c) continue;
        const s = String(c).trim();
        if (!s) continue;
        // Check for standard protocols
        if (s.startsWith('http://') || s.startsWith('https://')) return s;
        // Check for storage data which might be full URL
        if (s.startsWith('data:')) return s;
    }

    // transform relative/storage paths to absolute using API_STORAGE_URL
    for (const c of candidates) {
        if (!c) continue;
        let s = String(c).trim();
        if (!s) continue;

        // Clean up leading slashes
        s = s.replace(/^\/+/, '');

        // If it's a storage path, prepend storage URL
        if (s.startsWith('storage/')) {
            return `${API_BASE_URL.replace('/api', '')}/${s}`; // Fallback if API_STORAGE_URL isn't perfect
        }

        return `${API_STORAGE_URL}/${s}`;
    }

    // final fallback to inline SVG data URI to avoid network 404s
    return PLACEHOLDER_DATA_URI;
};

// Test cases
console.log('Running Verification Tests...\n');

const tests = [
    {
        name: 'Absolute URL',
        input: { image: 'https://example.com/image.jpg' },
        expected: 'https://example.com/image.jpg'
    },
    {
        name: 'Storage Path',
        input: { image: 'products/saree1.jpg' },
        expected: 'http://127.0.0.1:8000/storage/products/saree1.jpg'
    },
    {
        name: 'Storage Path with slash',
        input: { image: '/products/saree2.jpg' },
        expected: 'http://127.0.0.1:8000/storage/products/saree2.jpg'
    },
    {
        name: 'Explicit storage/ prefix',
        input: { image: 'storage/products/saree3.jpg' },
        expected: 'http://127.0.0.1:8000/storage/products/saree3.jpg'
    },
    {
        name: 'Nested Product Object',
        input: { product: { imageUrl: 'https://example.com/nested.jpg' } },
        expected: 'https://example.com/nested.jpg'
    },
    {
        name: 'Images Array',
        input: { product: { images: [{ url: 'https://example.com/array.jpg' }] } },
        expected: 'https://example.com/array.jpg'
    },
    {
        name: 'Missing Image (Placeholder)',
        input: {},
        expected: PLACEHOLDER_DATA_URI
    }
];

let passed = 0;
tests.forEach(test => {
    const result = getImageUrl(test.input);
    if (result === test.expected) {
        console.log(`[PASS] ${test.name}`);
        passed++;
    } else {
        console.log(`[FAIL] ${test.name}`);
        console.log(`  Expected: ${test.expected}`);
        console.log(`  Actual:   ${result}`);
    }
});

console.log(`\nTests Passed: ${passed}/${tests.length}`);

if (passed === tests.length) {
    console.log('Verification SUCCESS');
} else {
    console.log('Verification FAILED');
    process.exit(1);
}
