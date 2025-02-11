export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          full_name: string
          birth_date: string
          birth_time: string | null
          birth_location: string | null
          latitude: number | null
          longitude: number | null
          has_unknown_birth_time: boolean
          timezone: string
          has_accepted_terms: boolean
          acknowledged: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          birth_date: string
          birth_time?: string | null
          birth_location?: string | null
          latitude?: number | null
          longitude?: number | null
          has_unknown_birth_time?: boolean
          timezone: string
          has_accepted_terms?: boolean
          acknowledged?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_credits: {
        Row: {
          id: string
          user_id: string
          total_credits: number
          used_credits: number
          rollover_credits: number | null
          is_subscriber: boolean
          subscription_start_date: string | null
          created_at: string
          updated_at: string
          trial_expiration_date: string | null
          next_payment_date: string | null
          subscription_end_date: string | null
          trial_end_date: string | null
          rollover_expiration_date: string | null
          stripe_subscription_id: string | null
        }
        Insert: {
          user_id: string
          total_credits?: number
          used_credits?: number
          rollover_credits?: number | null
          is_subscriber?: boolean
          subscription_start_date?: string | null
          created_at?: string
          updated_at?: string
          trial_expiration_date?: string | null
          next_payment_date?: string | null
          subscription_end_date?: string | null
          trial_end_date?: string | null
          rollover_expiration_date?: string | null
          stripe_subscription_id?: string | null
        }
      }
    }
  }
}
