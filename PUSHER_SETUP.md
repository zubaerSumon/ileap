# Pusher Setup Guide

This guide will help you set up Pusher for real-time messaging in your ILEAP application.

## What is Pusher?

Pusher is a cloud-based service that provides real-time communication infrastructure. It replaces the in-memory EventEmitter system with a scalable, cloud-based pub/sub system that works across multiple server instances (like Vercel).

## Why Pusher?

- **Works on Vercel**: Unlike in-memory systems, Pusher works with serverless functions
- **Scalable**: Handles multiple server instances and users
- **Reliable**: Cloud-based infrastructure with high availability
- **Real-time**: Instant message delivery across devices

## Setup Steps

### 1. Create a Pusher Account

1. Go to [https://dashboard.pusher.com/](https://dashboard.pusher.com/)
2. Sign up for a free account
3. Create a new app

### 2. Get Your Credentials

After creating an app, you'll get:
- **App ID**
- **Key** (public)
- **Secret** (private)
- **Cluster** (e.g., `us2`, `eu`, `ap1`)

### 3. Configure Environment Variables

Add these to your `.env.local` file:

```env
# Pusher Configuration
PUSHER_APP_ID=your_app_id_here
NEXT_PUBLIC_PUSHER_KEY=your_key_here
PUSHER_SECRET=your_secret_here
NEXT_PUBLIC_PUSHER_CLUSTER=your_cluster_here
```

### 4. Restart Your Development Server

```bash
# Stop your current server (Ctrl+C)
# Then restart
pnpm dev
```

## Testing

### 1. Test Connection

Visit `/test-pusher` to check if Pusher is configured correctly.

### 2. Test Real-time Messaging

1. Open your app on two different devices
2. Log in with different user accounts
3. Send a message from one user to the other
4. Verify the message appears in real-time without refresh

## How It Works

### Before (In-memory EventEmitter)
```
Device A → Server A → EventEmitter (in-memory)
Device B → Server B → EventEmitter (in-memory)
❌ No communication between servers
```

### After (Pusher)
```
Device A → Server A → Pusher Cloud
Device B → Server B → Pusher Cloud
✅ Real-time communication via cloud
```

## Files Modified

- `lib/pusher.ts` - Pusher configuration
- `server/modules/message/subscriptions.ts` - Replaced EventEmitter with Pusher
- `hooks/usePusherSubscription.ts` - New client-side Pusher hook
- `hooks/useMessages.ts` - Removed EventSource logic
- `hooks/useConversations.ts` - Removed EventSource logic
- `components/layout/messages/MessageUI.tsx` - Updated to use Pusher hook

## Troubleshooting

### Connection Issues
- Check environment variables are set correctly
- Verify Pusher app is in the correct cluster
- Check browser console for connection errors

### Messages Not Appearing
- Ensure both devices are accessing the same server
- Check Pusher dashboard for event delivery
- Verify user IDs are being passed correctly

### Environment Variables Not Loading
- Restart your development server after adding variables
- Check that `.env.local` is in the project root
- Verify variable names match exactly

## Deployment

### Vercel
1. Add environment variables in Vercel dashboard
2. Deploy your application
3. Test real-time messaging across different devices

### Other Platforms
- Add environment variables to your hosting platform
- Ensure all variables are set correctly
- Test the `/test-pusher` page after deployment

## Cost

- **Free Tier**: 200,000 messages/day, 100 concurrent connections
- **Paid Plans**: Start at $49/month for higher limits
- **Perfect for development and small to medium apps**

## Support

- [Pusher Documentation](https://pusher.com/docs)
- [Pusher Dashboard](https://dashboard.pusher.com/)
- Check the `/test-pusher` page for connection status 