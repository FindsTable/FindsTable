# Layouts Documentation

## Overview
The application uses two main layouts for handling different authentication states:
- `private-route.vue` - For authenticated users
- `public-route.vue` - For public/unauthenticated access

## Private Route Layout (`private-route.vue`)

### Description
The private route layout is the main authenticated user interface layout. It provides a structured view with a sidebar, main content area, and mobile bottom bar. This layout is used for all pages that require authentication.

### Structure
- Side navigation bar (desktop)
- Main content area with multiple slot zones
- Mobile bottom navigation bar
- Responsive design that adapts to different screen sizes

### Available Slots
1. `topContent`
   - Located at the top of the main content area
   - Used for page-specific top content like notifications or alerts

2. `tabs`
   - Navigation slot under the top content
   - Used for page-specific tab navigation

3. `title`
   - Main page title slot
   - Rendered inside a TH1 component

4. `header`
   - Located below the title
   - Used for page-specific header content
   - Has top margin (marTop10)

5. `noScrollMain`
   - Content that should stay fixed (not scroll)
   - Located before the scrollable content

6. `scrollMain`
   - Main scrollable content area
   - Has minimum height of 50vh
   - Wrapped in a scrollable container

### Features
- Conditional rendering based on authentication state
- Responsive sidebar that can be toggled
- Mobile-friendly bottom navigation
- Safe area padding
- Scrollable main content with preserved header

## Public Route Layout (`public-route.vue`)

### Description
The public route layout is used for unauthenticated pages like login, signup, and public information pages. It provides a simpler, centered layout focused on content presentation.

### Structure
- Centered content layout
- Fixed bottom bar
- Footer component

### Available Slots
1. Default slot
   - Main content area
   - Wrapped in ContentWidth component with small width
   - Centered in the page
   - Includes automatic spacing (gap20)

### Features
- Centered content design
- Consistent width constraints
- Built-in footer component
- Bottom bar for navigation
- Scrollable content area

## Common Layout Features
Both layouts:
- Take full viewport height
- Use flex layout for content organization
- Include bottom navigation elements
- Support responsive design
- Handle content overflow appropriately

## Usage Guidelines

### Private Route Layout
Use for:
- User dashboard
- Settings pages
- Profile pages
- Any authenticated features

Example:
```vue
<template>
  <div>
    <template #title>Dashboard</template>
    <template #tabs>
      <TabNavigation />
    </template>
    <template #scrollMain>
      <DashboardContent />
    </template>
  </div>
</template>
```

### Public Route Layout
Use for:
- Login page
- Sign up page
- Landing pages
- Public information pages

Example:
```vue
<template>
  <div>
    <LoginForm />
  </div>
</template>
```

## Best Practices
1. Always use appropriate layout based on authentication requirement
2. Utilize provided slots for consistent page structure
3. Consider mobile responsiveness when adding content
4. Keep fixed content (headers, navigation) in appropriate non-scrolling slots
5. Use the `scrollMain` slot for main content that might overflow
