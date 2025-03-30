// app/api/webhooks/stripe/route.js
import { NextResponse } from 'next/server';
import stripe from '@/lib/stripe';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request) {
  const payload = await request.text();
  const signature = request.headers.get('stripe-signature');

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  try {
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const checkoutSession = event.data.object;
        // Process the checkout completion
        await handleCheckoutSessionCompleted(checkoutSession);
        break;
        
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription = event.data.object;
        // Process subscription status changes
        await handleSubscriptionChange(subscription);
        break;
        
      case 'customer.subscription.deleted':
        const canceledSubscription = event.data.object;
        // Handle subscription cancellation
        await handleSubscriptionCanceled(canceledSubscription);
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

// Webhook handler functions
async function handleCheckoutSessionCompleted(session) {
  if (session.mode !== 'subscription') return;

  const userId = session.metadata.userId;
  const subscriptionId = session.subscription;

  await connectToDatabase();
  
  // Update user with subscription info
  await User.findByIdAndUpdate(userId, {
    subscriptionId: subscriptionId,
    membershipStatus: 'premium'
  });
}

async function handleSubscriptionChange(subscription) {
  const customerId = subscription.customer;
  const status = subscription.status;
  
  await connectToDatabase();
  
  const user = await User.findOne({ stripeCustomerId: customerId });
  if (!user) return;

  // Update membership status based on subscription status
  const membershipStatus = 
    ['active', 'trialing'].includes(status) ? 'premium' : 'free';
  
  await User.findByIdAndUpdate(user._id, {
    membershipStatus,
    subscriptionId: subscription.id
  });
}

async function handleSubscriptionCanceled(subscription) {
  const customerId = subscription.customer;
  
  await connectToDatabase();
  
  // Find user and downgrade to free tier
  await User.findOneAndUpdate(
    { stripeCustomerId: customerId },
    { 
      membershipStatus: 'free',
      subscriptionId: null
    }
  );
}