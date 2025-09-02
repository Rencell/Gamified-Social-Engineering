const facebookAppId: string = import.meta.env.VITE_FACEBOOK_APP_ID || 'YOUR_DEFAULT_APP_ID';

declare global {
    interface Window {
        fbAsyncInit?: () => void;
        FB?: {
            init: (options: {
                appId: string;
                cookie: boolean;
                xfbml: boolean;
                version: string;
            }) => void;
            getLoginStatus: (callback: (response: { authResponse?: { accessToken: string } }) => void) => void;
        };
    }
}

export function initFacebookSdk(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        // Wait for Facebook SDK to initialize before starting the Vue app
        window.fbAsyncInit = function () {
            if (window.FB) {
                window.FB.init({
                    appId: facebookAppId,
                    cookie: true,
                    xfbml: true,
                    version: 'v8.0',
                });

                // Auto authenticate with the API if already logged in with Facebook
                window.FB.getLoginStatus(({ authResponse }) => {
                    console.log('FB.getLoginStatus called');
                    resolve();
                });
            } else {
                console.error('Facebook SDK not loaded.');
                reject(new Error('Facebook SDK not loaded.'));
            }
        };

        // Load Facebook SDK script
        (function (d, s, id) {
            let js: HTMLScriptElement | null;
            const fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                resolve(); // Script already loaded
                return;
            }
            js = d.createElement(s) as HTMLScriptElement;
            js.id = id;
            js.src = 'https://connect.facebook.net/en_US/sdk.js';
            js.async = true;
            js.defer = true;
            js.onload = () => console.log('Facebook SDK script loaded.');
            js.onerror = () => reject(new Error('Failed to load Facebook SDK script.'));
            fjs.parentNode?.insertBefore(js, fjs);
        })(document, 'script', 'facebook-jssdk');
    });
}