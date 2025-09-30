# Pages Documentation

## Main Pages

### Home
- **Route**: `/`
- **File**: `index.vue`
- **Description**: Landing page for the application
- **Layout**: Public route for unauthenticated users, private route for authenticated users
- **Features**: 
  - Login/Signup form for unauthenticated users
  - Feed and dashboard for authenticated users

### Login
- **Route**: `/login`
- **File**: `login.vue`
- **Description**: User authentication page
- **Layout**: Public route
- **Features**:
  - Email/password login
  - Forgot password link
  - Signup redirect

### Settings
- **Route**: `/settings`
- **File**: `Settings.vue`
- **Description**: User settings and preferences
- **Layout**: Private route
- **Sections**:
  - Account settings
  - Application preferences
  - Notification settings
  - Language preferences

### Account
- **Route**: `/account`
- **Description**: User account management
- **Layout**: Private route
- **Features**:
  - Profile information
  - Account settings
  - Connected accounts

## Content Pages

### Finds
- **Route**: `/finds/[id]`
- **Description**: Individual find display page
- **Layout**: Private route
- **Features**:
  - Find details
  - Images
  - Comments
  - Location data

- **Route**: `/finds/new`
- **Description**: Create new find entry
- **Features**:
  - Image upload
  - Location input
  - Find details form

### Hunt Reports
- **Route**: `/hunt-reports/[id]`
- **Description**: View hunt report
- **Layout**: Private route
- **Features**:
  - Report details
  - Associated finds
  - Comments

- **Route**: `/hunt-reports/new`
- **Description**: Create new hunt report
- **Features**:
  - Report form
  - Image upload
  - Location tagging
  - Weather conditions

### Home Feed
- **Route**: `/home/[tab]`
- **Description**: Main feed with different tabs
- **Layout**: Private route
- **Tabs**:
  - Finds
  - Thoughts
  - Hunt Reports

## User Pages

### Notifications
- **Route**: `/notifications`
- **Description**: User notifications center
- **Layout**: Private route
- **Features**:
  - Activity notifications
  - System messages
  - Interaction alerts

### Success Badges
- **Route**: `/success-badges`
- **Description**: Achievement and badges display
- **Layout**: Private route
- **Features**:
  - Badge collection
  - Achievement progress
  - Badge details

## Patreon Integration

### Campaign
- **Route**: `/patreon/campaign`
- **Description**: Patreon campaign information
- **Layout**: Private route
- **Features**:
  - Tier information
  - Benefits overview
  - Support options

### Account Linking
- **Route**: `/patreon/link-account/redirection`
- **Description**: Patreon account linking process
- **Layout**: Private route

### Account Unlinking
- **Route**: `/patreon/account/unlink`
- **Description**: Patreon account unlinking
- **Layout**: Private route

## Redirection Pages

### Email Verification
- **Route**: `/redirection/email-verification`
- **Description**: Email verification confirmation
- **Layout**: Public route

### New Account
- **Route**: `/redirection/new-account-created`
- **Description**: Post-signup success page
- **Layout**: Public route

### Patreon Link
- **Route**: `/redirection/patreon/link-account`
- **Description**: Patreon OAuth redirection handler
- **Layout**: Private route

## Legal & Information

### Privacy Policy
- **Route**: `/privacy`
- **Description**: Privacy policy page
- **Layout**: Public route

### Legal Notice
- **Route**: `/legal-notice`
- **Description**: Legal information
- **Layout**: Public route

### Cookies Policy
- **Route**: `/cookies`
- **Description**: Cookie usage information
- **Layout**: Public route

## Page Features

### Common Components
Most pages utilize these common components:
- Navigation header
- Footer
- Loading states
- Error handling
- Authentication checks

### Authentication Requirements
- Public pages: Accessible to all users
- Private pages: Require authentication
- Mixed pages: Different content for authenticated/unauthenticated users

### Layouts
Pages use one of two layouts:
- `public-route.vue`: For unauthenticated access
- `private-route.vue`: For authenticated users

### Meta Information
Each page includes:
- Page title
- Meta description
- Open Graph tags for social sharing
- Required authentication level

### State Management
Pages interact with these states:
- User state
- Application state
- Content state
- Navigation state

## Best Practices

1. Authentication
   - Always check authentication state
   - Redirect unauthorized users
   - Handle token expiration

2. Data Loading
   - Show loading states
   - Handle errors gracefully
   - Cache when appropriate

3. SEO
   - Provide meta information
   - Use semantic HTML
   - Include page descriptions

4. Performance
   - Lazy load components
   - Optimize images
   - Cache API responses

5. User Experience
   - Consistent navigation
   - Clear error messages
   - Loading indicators
   - Responsive design
