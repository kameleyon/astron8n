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
  export interface BillingInfo {
    next_payment_date: string;
    activities: string[];
  }