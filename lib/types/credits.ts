export interface RolloverCredit {
  amount: number;
  expiry_date: string;
}

export interface CreditInfo {
  total_credits: number;
  used_credits: number;
  rollover_credits: RolloverCredit[];
  is_subscriber: boolean;
  subscription_start_date: string | null;
  trial_end_date?: string | null;
}

export interface BillingActivity {
  type: 'subscription_payment' | 'token_purchase';
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  tokens?: number;
}

export interface BillingInfo {
  next_payment_date: string | null;
  trial_end_date: string | null;
  is_trial: boolean;
  activities: BillingActivity[];
  payment_method?: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  } | null;
}
