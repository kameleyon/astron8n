# Subscription System Documentation

This document outlines the subscription system for AstroGenie, including trial periods, automatic payments, and credit management.

## Overview

AstroGenie uses a subscription-based model with the following features:
- 3-day free trial for new users
- Monthly subscription with automatic renewal
- 40,000 credits per billing cycle
- Access restrictions for expired trials and failed payments

## Database Schema

The subscription system uses the `user_credits` table with the following key fields:

| Field | Type | Description |
|-------|------|-------------|
| user_id | uuid | References auth.users(id) |
| total_credits | integer | Total credits available to the user |
| used_credits | integer | Credits used by the user |
| is_subscriber | boolean | Whether the user has an active subscription |
| subscription_start_date | timestamptz | When the subscription started |
| trial_end_date | timestamptz | When the trial period ends |
| last_payment_date | timestamptz | When the last payment was processed |
| next_payment_date | timestamptz | When the next payment is due |
| stripe_subscription_id | text | Stripe subscription ID |
| payment_status | text | Current payment status |

## Subscription Flow

1. **New User Registration**
   - User signs up for AstroGenie
   - User gets 1,500 initial credits
   - User can start a 3-day trial of the premium subscription

2. **Trial Period**
   - User has full access to all features
   - Trial lasts for 3 days
   - User receives 40,000 credits during the trial

3. **Trial End**
   - When the trial ends, Stripe automatically charges the user
   - If payment succeeds, the subscription becomes active
   - If payment fails, the user loses access to the chat feature

4. **Active Subscription**
   - User is charged monthly
   - User receives 40,000 credits each billing cycle
   - User has full access to all features

5. **Failed Payment**
   - If a payment fails, the user's subscription status is set to inactive
   - User can still purchase reports but cannot use the chat feature
   - User can update their payment method to reactivate their subscription

## API Endpoints

### Webhook Handler
- **Path**: `/api/webhook/stripe`
- **Purpose**: Handles Stripe webhook events
- **Events Handled**:
  - `checkout.session.completed`: Initial subscription setup
  - `customer.subscription.trial_will_end`: Notification before trial ends
  - `invoice.payment_succeeded`: Successful payment processing
  - `invoice.payment_failed`: Failed payment handling
  - `customer.subscription.deleted`: Subscription cancellation

### Subscription Check
- **Path**: `/api/check-subscription`
- **Purpose**: Checks if a user has an active subscription or trial
- **Response**: Information about subscription status, trial status, and remaining credits

### Credit Update
- **Path**: `/api/update-credits`
- **Purpose**: Updates a user's credit usage after using the chat
- **Request**: Number of tokens used
- **Response**: Updated remaining credits

## Frontend Integration

The frontend should:
1. Check subscription status before allowing chat access
2. Display appropriate messages for expired trials and failed payments
3. Provide a way for users to update their payment method
4. Show remaining credits and next payment date

## Testing

To test the subscription system:
1. Create a test user
2. Start a trial subscription
3. Verify the trial end date is set correctly
4. Simulate a successful payment
5. Verify the subscription becomes active
6. Simulate a failed payment
7. Verify the user loses access to the chat feature

## Troubleshooting

Common issues:
- **Missing Stripe webhook events**: Check Stripe dashboard and webhook configuration
- **Failed payments not updating user status**: Verify webhook handler is processing events correctly
- **Users not receiving credits**: Check the subscription webhook handler
