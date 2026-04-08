import type { Analytics } from "firebase/analytics"
import type { FirebaseApp } from "firebase/app"
import type { Auth } from "firebase/auth"
import type { Firestore } from "firebase/firestore"

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

interface FirebaseServices {
  app: FirebaseApp
  analytics: Analytics | null
  auth: Auth
  db: Firestore
}

let appPromise: Promise<FirebaseApp | null> | null = null
let authPromise: Promise<Auth | null> | null = null
let firestorePromise: Promise<Firestore | null> | null = null
let analyticsPromise: Promise<Analytics | null> | null = null
let firebaseServicesPromise: Promise<FirebaseServices | null> | null = null

async function getFirebaseApp(): Promise<FirebaseApp | null> {
  if (!isFirebaseConfigured) {
    return null
  }

  if (!appPromise) {
    appPromise = (async () => {
      try {
        const { initializeApp } = await import("firebase/app")
        const app = initializeApp(firebaseConfig)
        console.log("✅ Firebase initialized successfully")
        return app
      } catch (error) {
        console.error("❌ Error initializing Firebase:", error)
        return null
      }
    })()
  }

  return appPromise
}

export async function getAuthService(): Promise<Auth | null> {
  if (!authPromise) {
    authPromise = (async () => {
      const [app, authModule] = await Promise.all([
        getFirebaseApp(),
        import("firebase/auth"),
      ])

      return app ? authModule.getAuth(app) : null
    })()
  }

  return authPromise
}

export async function getFirestoreService(): Promise<Firestore | null> {
  if (!firestorePromise) {
    firestorePromise = (async () => {
      const [app, firestoreModule] = await Promise.all([
        getFirebaseApp(),
        import("firebase/firestore"),
      ])

      return app ? firestoreModule.getFirestore(app) : null
    })()
  }

  return firestorePromise
}

export async function getAnalyticsService(): Promise<Analytics | null> {
  if (!analyticsPromise) {
    analyticsPromise = (async () => {
      const [app, analyticsModule] = await Promise.all([
        getFirebaseApp(),
        import("firebase/analytics"),
      ])

      if (!app || typeof window === "undefined" || !firebaseConfig.measurementId) {
        return null
      }

      return analyticsModule.getAnalytics(app)
    })()
  }

  return analyticsPromise
}

export async function getFirebaseServices(): Promise<FirebaseServices | null> {
  if (!firebaseServicesPromise) {
    firebaseServicesPromise = (async () => {
      const [app, auth, db, analytics] = await Promise.all([
        getFirebaseApp(),
        getAuthService(),
        getFirestoreService(),
        getAnalyticsService(),
      ])

      if (!app || !auth || !db) {
        return null
      }

      return { app, analytics, auth, db }
    })()
  }

  return firebaseServicesPromise
}

if (!isFirebaseConfigured) {
  console.warn('⚠️ Firebase not configured - Auth features will be disabled')
}

export { isFirebaseConfigured }
export default getFirebaseServices
