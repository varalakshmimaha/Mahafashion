import('http').then(http => {
    const options = {
        hostname: '127.0.0.1',
        port: 8000,
        path: '/api/orders/11',
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer test-token'
        }
    };

    const req = http.request(options, (res) => {
        let data = '';

        console.log('Status Code:', res.statusCode);
        console.log('Headers:', res.headers);

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            console.log('Response Body:', data);
            try {
                const json = JSON.parse(data);
                console.log('Parsed JSON:', JSON.stringify(json, null, 2));
            } catch (e) {
                console.log('JSON Parse Error:', e.message);
            }
        });
    });

    req.on('error', (e) => {
        console.error('Request Error:', e);
    });

    req.end();
});
