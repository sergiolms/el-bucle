import { initializeApp, type FirebaseApp } from "firebase/app"
import { getAnalytics, type Analytics } from "firebase/analytics"
import { getFirestore, type Firestore } from "firebase/firestore"
import { getAuth, type Auth } from "firebase/auth"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
}

const isFirebaseConfigured = !!(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId
)

let app: FirebaseApp | null = null
let analytics: Analytics | null = null
let db: Firestore | null = null
let auth: Auth | null = null

if (isFirebaseConfigured) {
  try {
    // Initialize Firebase
    app = initializeApp(firebaseConfig)

    // Initialize services
    analytics = typeof window !== 'undefined' ? getAnalytics(app) : null
    db = getFirestore(app)
    auth = getAuth(app)

    console.log('✅ Firebase initialized successfully')
  } catch (error) {
    console.error('❌ Error initializing Firebase:', error)
  }
} else {
  console.warn('⚠️ Firebase not configured - Auth features will be disabled')
}

export { analytics, db, auth, isFirebaseConfigured }
export default app
