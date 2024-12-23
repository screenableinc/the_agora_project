const axios = require('axios');
function jsonToQueryString(json, parentKey = '') {
    return Object.keys(json)
        .map((key) => {
            const fullKey = parentKey ? `${parentKey}[${key}]` : key;

            if (typeof json[key] === 'object' && !Array.isArray(json[key])) {
                return jsonToQueryString(json[key], fullKey);
            }

            return `${encodeURIComponent(fullKey)}=${encodeURIComponent(json[key])}`;
        })
        .join('&');
}
async function makePayment(data) {
    const url = 'http://127.0.0.1:5000/api/airtelmomo?'+jsonToQueryString(data);
    console.log(url)

    try {
        const response = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json', // Adjust the content type as needed
            },
        });

        // Assuming the server responds with JSON
        console.log('Payment successful:', response.data);
    } catch (error) {
        console.error('Error:', error.message);
    }
}





module.exports={
    makePayment:makePayment
}