# Free Tier Workflows Selection

## Selection Criteria
1. **Simple**: 3-5 nodes maximum
2. **Practical**: Common use cases that showcase value
3. **Beginner-Friendly**: Easy to understand and set up
4. **Diverse**: Show different integration types

## Selected Free Tier Workflows (7 total)

### 1. **Form to Slack Notification**
- **File**: `1148_Woocommerce_Slack_Create_Triggered.json`
- **Name**: New WooCommerce product to Slack
- **Nodes**: 3
- **Trigger**: Webhook
- **Integrations**: WooCommerce, Slack
- **Use Case**: Get instant Slack notifications when products are added
- **Why Free**: Shows webhook → notification pattern, very practical
- **Tier Settings**:
  - tier: "free"
  - tier_complexity: "simple"
  - is_lead_magnet: true
  - requires_login: false

### 2. **Social Media Auto-Post**
- **File**: `1211_Twitter_Strava_Create_Triggered.json`
- **Name**: Receive updates when a new activity gets created and tweet about it
- **Nodes**: 3
- **Trigger**: Webhook
- **Integrations**: Twitter/X, Strava
- **Use Case**: Automatically tweet when you complete a Strava workout
- **Why Free**: Shows cross-platform automation, social media integration
- **Tier Settings**:
  - tier: "free"
  - tier_complexity: "simple"
  - is_lead_magnet: true
  - requires_login: false

### 3. **Form Submission with SMS Confirmation**
- **File**: `0155_Mautic_Twilio_Update_Triggered.json`
- **Name**: Receive updates when a form is submitted in Mautic, and send a confirmation SMS
- **Nodes**: 3
- **Trigger**: Webhook
- **Integrations**: Mautic, Twilio
- **Use Case**: Send SMS confirmations for form submissions
- **Why Free**: Shows multi-channel communication, popular use case
- **Tier Settings**:
  - tier: "free"
  - tier_complexity: "simple"
  - is_lead_magnet: true
  - requires_login: false

### 4. **Calendar Event Creator**
- **File**: `0342_Manual_GoogleCalendar_Create_Triggered.json`
- **Name**: Add an event to Calendar
- **Nodes**: 3
- **Trigger**: Manual
- **Integrations**: Cal.com
- **Use Case**: Manually create calendar events with automation
- **Why Free**: Shows Google integration, productivity use case
- **Tier Settings**:
  - tier: "free"
  - tier_complexity: "simple"
  - is_lead_magnet: true
  - requires_login: false

### 5. **Deployment Notification to Slack**
- **File**: `0105_Netlify_Slack_Automate_Triggered.json`
- **Name**: Netlify deployment notifications to Slack
- **Nodes**: 3
- **Trigger**: Webhook
- **Integrations**: Netlify, Slack
- **Use Case**: Get Slack alerts for website deployments
- **Why Free**: Dev-friendly, shows CI/CD automation
- **Tier Settings**:
  - tier: "free"
  - tier_complexity: "simple"
  - is_lead_magnet: true
  - requires_login: false

### 6. **Drive File to Notion**
- **File**: `0272_Notion_GoogleDrive_Create_Triggered.json`
- **Name**: Google Drive file triggers Notion update
- **Nodes**: 3
- **Trigger**: Webhook
- **Integrations**: Google Drive, Notion
- **Use Case**: Sync Google Drive files with Notion
- **Why Free**: Shows cloud storage integration, knowledge management
- **Tier Settings**:
  - tier: "free"
  - tier_complexity: "simple"
  - is_lead_magnet: true
  - requires_login: false

### 7. **Email Marketing Automation**
- **File**: `0938_Manual_Mailchimp_Automation_Triggered.json`
- **Name**: Mailchimp email automation
- **Nodes**: 3
- **Trigger**: Manual
- **Integrations**: Mailchimp
- **Use Case**: Manually trigger Mailchimp email campaigns
- **Why Free**: Shows email marketing capability, lead nurturing
- **Tier Settings**:
  - tier: "free"
  - tier_complexity: "simple"
  - is_lead_magnet: true
  - requires_login: false

## Implementation Plan

### Step 1: Update Workflow JSON Files
For each workflow file, add tier metadata to the root level:
```json
{
  "name": "...",
  "nodes": [...],
  "connections": {...},
  "tier": "free",
  "tier_complexity": "simple",
  "is_lead_magnet": true,
  "requires_login": false
}
```

### Step 2: Reindex Database
Run: `python run.py --reindex`

### Step 3: Verify
Query database to confirm 7 workflows are tagged as free tier.

## Marketing Value
These 7 workflows showcase:
- ✅ Webhook triggers (5 workflows)
- ✅ Manual triggers (2 workflows)
- ✅ Popular integrations: Slack, Twitter, Mailchimp, Google Drive, Notion, Twilio
- ✅ Common use cases: Notifications, social media, email, calendar, deployments
- ✅ Easy to understand (3 nodes each)
- ✅ No login required → instant preview and testing
- ✅ Lead magnets → drive upgrades to paid tiers

## Next Steps
1. Update the 7 workflow JSON files with tier metadata
2. Reindex database
3. Update frontend to show "Free" badges on these workflows
4. Update API to filter by tier
5. Add marketing copy highlighting free workflows on landing page
