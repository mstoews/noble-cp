import { AuthMode } from 'app/modules/auth/auth.enum'
export const environment = {
  firebase: {
    projectId: 'condo-mgmt',
    appId: '1:1023314501312:web:a7cc0b9047944b25b9d725',
    storageBucket: 'condo-mgmt.appspot.com',
    locationId: 'us-central',
    apiKey: 'AIzaSyAF8q2eq1tAhBO4PvCeNvVQR7oKy5LYUjw',
    authDomain: 'condo-mgmt.firebaseapp.com',
    messagingSenderId: '1023314501312',
    measurementId: 'G-5BFE1ESWF1',
  },
    production: true,
    useEmulators: false,
    //baseUrl: "https://noble-server-omq5x5dxza-ue.a.run.app",
    baseUrl: "http://localhost:8080",
    api :  {
        createAdmin: "http://localhost:9000/api/add-admin",
    },
    authMode: AuthMode.CustomServer,
};
