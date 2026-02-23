async function createWebhook() {
    const res = await fetch('https://api.clerk.com/v1/webhooks/endpoints', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer sk_test_ncdD5vDbj5t1ooj3vnynLIfVCEj82cPGeqH1Le6Asl',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            url: 'https://nonobservable-ferally-trinh.ngrok-free.dev/api/webhooks/clerk',
            enabled_events: ['user.created', 'user.updated', 'user.deleted']
        })
    });
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
}

createWebhook();
