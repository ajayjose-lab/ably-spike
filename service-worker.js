// Handle push events
self.addEventListener("push", (event) => {
    const eventData = event.data.json();

    console.log("here in the service worker: line 5")
    console.log(eventData);
    console.log("here in the service worker: line 7")

    // Prepare the notification object suitable for both `showNotification` and `postMessage`
    const notification = {
        title: eventData.notification.title,
        body: eventData.notification.body,
        data: eventData.data,
        icon: "https://www.iconarchive.com/download/i143622/iconarchive/wild-camping/Weather-Cloudy.64.png",
        image: "https://www.iconarchive.com/download/i143606/iconarchive/wild-camping/Tent.256.png",
        actions: [
            {
                action: 'yes-action',
                title: '👍 Good',
                type: 'button'
            },
            {
                action: 'no-action',
                title: '👎 Bad',
                type: 'button'
            }
        ]

    };

    // Display a native browser notification
    self.registration.showNotification(notification.title, notification);

    // Also send to open pages (optional, for demonstration purposes)
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
            clientList.forEach(client => {
                client.postMessage({
                    type: 'tutorial-push',
                    notification: notification
                });
            });
        })
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', function (event) {
    event.notification.close();

    // Open or focus the app window
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
            const url = event.notification.data?.url || '/';

            // Check if there's already a window open
            for (let i = 0; i < clientList.length; i++) {
                const client = clientList[i];
                if (client.url === url || url === '/') {
                    client.postMessage({
                        type: 'tutorial-push-click',
                        notification: {
                            title: event.notification.title + " " + event.action + " was clicked",
                            body: event.notification.body,
                            data: event.notification.data
                        }
                    });
                    if (client.focus) {
                        return client.focus();
                    }
                }
            }

            // Open a new window if none exists
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
});


