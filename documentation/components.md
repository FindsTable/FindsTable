# Components Documentation

## Architecture Components

### Layout and Structure
- `AppBox.vue`
  - Main layout container component
  - No props required

- `ContentWidth.vue`
  - Controls content width with different size options
  - Props:
    - `full`: boolean - Full width
    - `large`: boolean - Max 1200px width
    - `medium`: boolean - Max 800px width
    - `small`: boolean - Small width
    - `scrollable`: boolean - Enables scrolling

### Frames
- `Avatar.vue`
  - Displays user avatar with various options
  - Props:
    - `fileUrl`: string - Direct URL to avatar image
    - `fileId`: string - Directus file ID
    - `pointer`: boolean - Makes avatar clickable
    - `round`: boolean - Makes avatar round
    - `width`: string - Avatar width (default: '100px')

- `PatreonAvatar.vue`
  - Displays Patreon-specific avatar with tier badge
  - Props:
    - `patreonAccount`: Object - Patreon account details with tier info

### Panel
- `ArchitecturePanelMain.vue`
  - Basic panel component with theme support
  - Props:
    - `themeSurface2`: boolean - Uses secondary surface theme

### Touch
- `Button.vue`
  - Touch-friendly button component
  - Props:
    - `element`: string (required) - HTML element to render
    - `icon`: string - Icon name
    - `text`: boolean - Text mode
    - `bStyle`: string - Button style class

## Form Components

### Basic Inputs
- `Input.vue`
  - Generic input component with type support
  - Props:
    - `type`: string - Input type (text/number)
    - `maxValue`, `minValue`, `step`: number - For number inputs
    - `placeholder`: string|number
    - `minlength`, `maxlength`: number
    - `spellcheck`: boolean
  - Uses `v-model`

- `Textarea.vue`
  - Textarea input component
  - Props:
    - `label`: string
    - `placeholder`: string
  - Uses `v-model`

### Form Structure
- `Label.vue`
  - Label wrapper for form inputs
  - Props:
    - `labelClick`: boolean - Enable/disable label clicks
  - Slots:
    - `label`: Label content
    - `input`: Input content

- `Fieldset.vue`
  - Groups related form elements
  - Props:
    - `title`: string (required)
    - `switch`: boolean - Adds toggle switch

### Specialized Inputs
- `NewItem/Title.vue`
  - Title input for new items
  - Props:
    - `textPath`: string - i18n path for label
    - `placeholderPath`: string - i18n path for placeholder
  - Uses `v-model`

- `NewItem/Description.vue`
  - Expandable textarea for descriptions
  - Props:
    - `textPath`: string - i18n path for label
  - Uses `v-model`

## Content Components

### User Related
- `users/Cards/Mini.vue`
  - Compact user card with avatar
  - Props:
    - `userId`: string
    - `avatarId`: string
    - `username`: string
    - `date`: string

### Badges
- `Badges/Store.vue`
  - Badge selection/display component
  - Props:
    - `badges`: Badge[] - Array of badge objects
  - Events:
    - `selectBadge` - Emitted when badge is selected

### Hunt Reports
- `HuntReports/New/main.vue`
  - New hunt report creation form
  - Complex form with multiple sections
  - Manages status, date, title, content, biome, weather tags

## Widget Components

### Social Interactions
- `Follow/Preferences/Main.vue`
  - Follow preferences management
  - Props:
    - `data`: {user: Object, follow: Object}

### LikesAndComments
- `LikesAndComments/Main.vue`
  - Likes and comments display/interaction
  - Props:
    - `fontSize`: string
    - `iconSize`: string
    - `collection`: string
    - `item`: Object
    - `likeClick`: boolean
    - `commentClick`: boolean
    - `bookmark`: boolean
  - Events:
    - `likeClick`
    - `commentClicked`

## Page Components

### Settings
- `Settings/Tabs/Account/Main.vue`
  - Account settings page
  - Combines Avatar, Badges, Credentials, and DangerZone components

### Login/Signup
- `Index/LoginSignup/InputField.vue`
  - Customized input field for login/signup forms
  - Props:
    - `id`: string
    - `type`: string (default: 'text')
    - `name`: string (required)
    - `label_key`: string (required)
    - `placeholder_key`: string (required)
    - `showLabel`: boolean

## Notes:
1. Some components like `Architecture/Cards/User/Mini.vue` appear to be deprecated (commented out code)
2. Many components rely heavily on the i18n system for labels and messages
3. There's a consistent use of utility classes for layout (flex, gap, etc.)
4. Form components often use the new Vue 3 `defineModel()` composition API
5. Some components need type improvements (any types in props)
6. The project follows a clear component hierarchy: Architecture > Content > Forms > Widgets

Best Practices:
1. Always use type-safe props when possible
2. Use i18n keys for text content
3. Follow the established component category structure
4. Use the available utility classes for layout
5. Leverage the common components (ContentWidth, Panel, etc.) for consistency
