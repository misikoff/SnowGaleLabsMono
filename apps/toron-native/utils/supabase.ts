// import 'react-native-url-polyfill/auto'
// import AsyncStorage from '@react-native-async-storage/async-storage'
// import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string
// const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string

// let client: SupabaseClient | null = null

// export function getSupabase() {
//   if (__DEV__) {
//     console.log('Creating new Supabase client')
//     // Always re-create in dev to avoid stale state
//     return createClient(supabaseUrl, supabaseAnonKey, {
//       auth: {
//         storage: AsyncStorage,
//         autoRefreshToken: true,
//         persistSession: true,
//         detectSessionInUrl: false,
//       },
//     })
//   }

//   if (!client) {
//     client = createClient(supabaseUrl, supabaseAnonKey, {
//       auth: {
//         storage: AsyncStorage,
//         autoRefreshToken: true,
//         persistSession: true,
//         detectSessionInUrl: false,
//       },
//     })
//   }

//   return client
// }

import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string

let supabase: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (!supabase) {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  }

  return supabase
}
