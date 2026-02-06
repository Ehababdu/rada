import './i18n';

/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allows your team to easily build robust real-time web applications.
 */

import axios from 'axios';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

console.log('Bootstrap loaded');
console.log('VITE_REVERB_HOST:', import.meta.env.VITE_REVERB_HOST);
console.log('VITE_REVERB_PORT:', import.meta.env.VITE_REVERB_PORT);

window.Pusher = Pusher;

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded fired');
    console.log('VITE_REVERB_HOST in DOM:', import.meta.env.VITE_REVERB_HOST);
    console.log('VITE_REVERB_PORT in DOM:', import.meta.env.VITE_REVERB_PORT);
    window.Echo = new Echo({
        broadcaster: 'reverb',
        key: import.meta.env.VITE_REVERB_APP_KEY,
        wsHost: import.meta.env.VITE_REVERB_HOST || 'localhost',
        wsPort: import.meta.env.VITE_REVERB_PORT || 8082,
        wssPort: import.meta.env.VITE_REVERB_PORT || 8082,
        forceTLS: (import.meta.env.VITE_REVERB_SCHEME || 'http') === 'https',
        enabledTransports: ['ws', 'wss'],
        authorizer: (channel) => {
            return {
                authorize: (socketId, callback) => {
                    axios
                        .post(
                            '/broadcasting/auth',
                            {
                                socket_id: socketId,
                                channel_name: channel.name,
                            },
                            {
                                headers: {
                                    'X-CSRF-TOKEN': document
                                        .querySelector('meta[name="csrf-token"]')
                                        .getAttribute('content'),
                                },
                            },
                        )
                        .then((response) => {
                            callback(false, response.data);
                        })
                        .catch((error) => {
                            callback(true, error);
                        });
                },
            };
        },
    });
});
