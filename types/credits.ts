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
  }
export interface BillingActivity {
  type: 'token_purchase' | 'subscription_payment';
  amount: number;
  tokens?: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface BillingInfo {
  next_payment_date: string | null;
  trial_end_date: string | null;
  is_trial: boolean;
  activities: BillingActivity[];
}
