/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_URL: string
  readonly VITE_ENABLE_SOCIAL_AUTH: string
  readonly VITE_ENABLE_AI_RECOMMENDATIONS: string
  readonly VITE_MAX_FILE_SIZE: string
  readonly VITE_ALLOWED_FILE_TYPES: string
  readonly VITE_MAX_BORROW_LIMIT: string
  readonly VITE_DEFAULT_BORROW_DAYS: string
  readonly VITE_FINE_PER_DAY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
