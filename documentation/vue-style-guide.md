# Vue/Nuxt Style Guide for FindsTable

## Naming Conventions

### Variables and ## Vue/Nuxt Usage

### Auto Imports
```ts
// Use auto-imports for Vue and Nuxt functionality
const count = ref(0)
const { t } = useI18n()
const userState = useUserState()

// Auto-import components
<UiButton />
<FormsInput />
```

### Component Communication
```ts
// For read-only state access
defineExpose({
    isLoading,
    status
})

// For two-way binding
const value = defineModel()

// For events without state
const emit = defineEmits(['update', 'select'])
```// Use camelCase
const formattedImage = ref(null)
function handleClick() {}
```

### Components
```ts
// Use PascalCase
ContentThoughtsNew.vue
WidgetsAvatarMain.vue
```

### CSS Classes
```css
/* Components with comp- prefix */
.comp-button
.comp-inputText

/* Modifiers with - prefix */
.-filled
.-outlined
.-bold
.-large

/* Utility classes from posoroko.css */
.flex
.gap10
.justifyCenter
```

## Code Formatting

### General Rules
- Indentation: 4 spaces
- Semicolons: Never use
- Function declarations: Use standard function syntax
- Arrow functions: Only for callbacks and simple returns

### Objects and Arrays
```ts
// One property per line
const config = {
    theme: 'light',
    layout: 'grid',
    enabled: true
}

const items = [
    'first',
    'second',
    'third'
]
```

### Template Attributes Order
```vue
<component
    v-if="condition"
    v-for="item in items"
    :key="item.id"
    @click="handleClick"
    class="static-class"
    :class="dynamicClass"
    :other-prop="value"
/>
```

### Component Naming
- Use PascalCase for component names
- Use descriptive, multi-word names
- Follow folder structure in name
```ts
// Examples
ContentThoughtsNew.vue
WidgetsAvatarMain.vue
ArchitectureLayoutPanel.vue
```

## Script Section

### Imports
```ts
// External imports first
import { computed, ref } from 'vue'
import type { PropType } from 'vue'

// Then project imports
import { useUserState } from '@/composables/userState'
import type { User } from '@/types'

// Component imports last
import { 
    ArchitectureFramesAvatar,
    FormsButton 
} from '#components'
```

### Props
```ts
// Use defineProps with type declaration
const props = defineProps<{
  user: User
  size?: 'small' | 'medium' | 'large'
  isActive: boolean
}>()

// Or with runtime validation
const props = defineProps({
  message: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    default: 0
  }
})
```

### Emits
```ts
// TypeScript style
const emit = defineEmits<{
  'update': [value: string]
  'select': [id: number, value: string]
}>()

// Runtime validation style
const emit = defineEmits(['update', 'select'])
```

### State Management
```ts
// Refs
const isLoading = ref(false)
const count = ref<number>(0)

// Computed
const displayName = computed(() => {
  return `@${props.username}`
})

// Composables
const userState = useUserState()
const { t } = useI18n()
```

## CSS Structure

### Component Styling
```css
/* No inline styles - use scoped CSS */
<style scoped>
.comp-button {
    /* base styles */
}
.comp-button.-filled {
    /* modifier styles */
}
</style>

/* Use CSS variables for colors */
.comp-button {
    background-color: var(--filledButton-bgColor)
    color: var(--textColor-main)
}
```

### Class Priority and Usage
```vue
<template>
    <!-- Utility classes first -->
    <div class="flex column gap20 justifyCenter">
        <!-- Then component classes with modifiers -->
        <button class="comp-button -filled -large">
            Click me
        </button>
    </div>
</template>
```

### CSS Variables Naming Convention
```css
/* Structure: --nature-name-variant-property */
/* Each part uses camelCase for readability */

/* Component Variables */
--comp-button-filled-bgColor
--comp-input-active-borderColor
--comp-modal-dark-shadowColor

/* Theme Variables */
--theme-surface1-bgColor
--theme-text-main-color
--theme-backdrop-dark-opacity

/* Color System */
--tone-grayScale-50      /* Tones */
--tone-zincScale-70
--color-findTable-main   /* Brand */
--color-findTable-dark
--signal-success-light   /* Signals */
--signal-error-dark
--trans-whiteScale-50    /* Transparency */
--trans-blackScale-30

/* States */
--state-hover-bgColor
--state-active-borderColor
--state-disabled-opacity
```

### Using CSS Variables
```css
.comp-button {
    /* Component-specific variables */
    background-color: var(--comp-button-filled-bgColor);
    border-color: var(--comp-button-filled-borderColor);
    color: var(--comp-button-filled-textColor);
}

.comp-button:disabled {
    /* State variables */
    opacity: var(--state-disabled-opacity);
    background-color: var(--comp-button-disabled-bgColor);
}

.theme-dark .comp-button {
    /* Theme-specific overrides */
    background-color: var(--comp-button-dark-bgColor);
}
```

## Template Section

### Template Structure
```vue
<template>
  <!-- Root element with component class -->
  <div class="component-root">
    <!-- Conditional rendering -->
    <div v-if="condition">
      <!-- Content -->
    </div>

    <!-- Lists with keys -->
    <ul>
      <li 
        v-for="item in items" 
        :key="item.id"
      >
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>
```

### Attributes Order
```vue
<component
  <!-- Vue directives first -->
  v-if=""
  v-show=""
  v-model=""
  v-for=""
  
  <!-- Props -->
  :prop=""
  
  <!-- Events -->
  @click=""
  @input=""
  
  <!-- HTML attributes -->
  id=""
  type=""
  
  <!-- Classes -->
  :class=""
  class=""
/>
```

### Event Handling
```vue
<!-- Use kebab-case for event names -->
<button @click="handleClick">
  Click me
</button>

<!-- Prevent event bubbling when needed -->
<button @click.stop="handleClick">
  Click me
</button>

<!-- For forms, prevent default -->
<form @submit.prevent="handleSubmit">
  <!-- form content -->
</form>
```

### Slots
```vue
<template>
  <!-- Named slots -->
  <slot name="header">
    <h2>Default header</h2>
  </slot>

  <!-- Default slot -->
  <slot />

  <!-- Scoped slots -->
  <slot
    name="item"
    :item="item"
    :index="index"
  />
</template>
```

## Component System

### Buttons
```css
/* Base */
.comp-button

/* Variants */
.-filled
.-outlined
.-text
.-shaped

/* States */
.selected
.disabled

/* Sizes */
.-large
.-bold

/* Special Types */
.-confirm
.-cancel
.-pageTab
```

### Forms
```css
/* Inputs */
.comp-inputText
.input-cutoutStyle
.-fontStyle-text
.-fontStyle-title

/* Labels */
.standardLabel

/* Switches */
.comp-forms-switch
.comp-forms-switch.true
```

### Typography
```css
/* Font Families */
.typeface-fraunces
.typeFace-main

/* Sizes */
.font-h1
.font-h2
.font-text

/* Modifiers */
.-tiny
.-small
.-big
.-bold
```

### Layout and Structure
```css

/* Scroll */
.overflowScroll.-scrollY

/* Z-Index */
.z_1000
.z_2000
```

## TypeScript Usage

### Type Imports
```ts
// Use type imports for better tree-shaking
import type { PropType } from 'vue'
import type { User } from '@/types'

// Use interface for complex props
interface Props {
  user: User
  config: {
    theme: string
    layout: 'grid' | 'list'
  }
}

const props = defineProps<Props>()
```

### Composables
```ts
// Type the return value
function useCustomHook(): {
  data: Ref<string>
  isLoading: Ref<boolean>
  fetch: () => Promise<void>
} {
  // implementation
}
```

## File Structure and Organization

### CSS Import Order
1. base
2. utilities
3. colors
4. architecture
5. components
6. typography

### Component Files
```css
/* _main_.css imports variants */
@import 'filled.css';
@import 'outlined.css';

/* Separate files per variant */
// filled.css
.comp-button.-filled { /* styles */ }

// outlined.css
.comp-button.-outlined { /* styles */ }
```

### Theme System
```css
/* Theme Classes */
.theme-backdropColor
.theme-textColor-main

/* App Themes */
#viewportContainer.light
#viewportContainer.dark
#viewportContainer.forest

/* Component Theming */
.comp-button {
    background: var(--button-bgColor);
    color: var(--button-textColor);
}
```

## Code Readability Philosophy

### Write Simple, Clear Code
```ts
// ❌ DON'T: Complex chaining and one-liners
const result = users.filter(u => u.age > 18).map(u => u.name).join(', ').split(' ').reverse()

// ✅ DO: Break down into readable steps
const adults = users.filter(user => user.age > 18)
const names = adults.map(user => user.name)
const nameString = names.join(', ')
const parts = nameString.split(' ')
const result = parts.reverse()
```

### Avoid Nested Ternaries
```ts
// ❌ DON'T: Nested ternary operations
const display = isLoggedIn ? 
    userType === 'admin' ? 'Admin Panel' : 
        userType === 'mod' ? 'Mod Tools' : 'Dashboard' 
    : 'Login'

// ✅ DO: Use clear if statements or simple conditions
function getDisplayText() {
    if (!isLoggedIn) {
        return 'Login'
    }
    
    if (userType === 'admin') {
        return 'Admin Panel'
    }
    
    if (userType === 'mod') {
        return 'Mod Tools'
    }
    
    return 'Dashboard'
}
```

### Clear Function Names and Purpose
```ts
// ❌ DON'T: Ambiguous multi-purpose functions
function handleData(data, type, mode, update) {
    // Does too many things
}

// ✅ DO: Clear, single-purpose functions
function validateUserInput(input) {
    // Only handles validation
}

function saveUserPreferences(preferences) {
    // Only saves preferences
}
```

### Template Clarity
```vue
// ❌ DON'T: Complex inline conditions
<div v-if="user && user.preferences && user.preferences.theme === 'dark' && !isLoading">

// ✅ DO: Use computed properties for complex conditions
<script setup>
const showThemeContent = computed(() => {
    if (isLoading) return false
    if (!user?.preferences) return false
    return user.preferences.theme === 'dark'
})
</script>

<template>
    <div v-if="showThemeContent">
</template>
```

### State Management
```ts
// ❌ DON'T: Complex reactive chains
const processedData = computed(() => 
    data.value?.filter(x => x.active)
        .map(x => ({...x, processed: true}))
        .sort((a, b) => b.date - a.date)
)

// ✅ DO: Break down into readable steps
const activeItems = computed(() => {
    if (!data.value) return []
    return data.value.filter(item => item.active)
})

const processedItems = computed(() => {
    return activeItems.value.map(item => ({
        ...item,
        processed: true
    }))
})

const sortedItems = computed(() => {
    return processedItems.value.sort((a, b) => {
        return b.date - a.date
    })
})
```

### Comments and Documentation
```ts
// ❌ DON'T: Assume code is self-documenting
function process(d) {
    return d.map(x => x * 2)
}

// ✅ DO: Write clear comments for logic and purpose
/**
 * Doubles each number in the array
 * @param {number[]} numbers - Array of numbers to process
 * @returns {number[]} Array with doubled values
 */
function doubleNumbers(numbers) {
    return numbers.map(number => number * 2)
}
```

## Key Rules Summary
1. Use 4-space indentation
2. No semicolons
3. Explicit and consistent naming
4. Utility classes first in templates
5. CSS variables for all colors
6. No inline styles
7. Break down complex operations into simple steps
8. Avoid method chaining and complex one-liners
9. Use clear, descriptive variable and function names
10. Write code that's easy for beginners to understand
11. Function names must be verbs/actions
12. Component organization follows folder structure
13. Always use scoped styles

### Performance
1. Use `v-show` for frequent toggles
2. Use `v-if` for conditional rendering
3. Use `key` with `v-for`
4. Avoid expensive computations in templates
5. Use async components for code-splitting

### State Management
1. Use composables for shared logic
2. Keep state close to where it's used
3. Use props for parent-child communication
4. Use events for child-parent communication
5. Use provide/inject for deep prop passing

### Code Style
1. Use 2 spaces for indentation
2. Use single quotes for strings
3. Use semicolons at the end of statements
4. Order component options consistently
5. Use TypeScript for better type safety

### File Organization
1. Group related components in folders
2. Use index.ts for barrel exports
3. Keep components reasonably sized
4. Split complex components
5. Use lazy loading for large components

## Examples

### Basic Component
```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  initialValue: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update': [value: number]
}>()

const count = ref(props.initialValue)
const doubled = computed(() => count.value * 2)

function increment() {
  count.value++
  emit('update', count.value)
}
</script>

<template>
  <div class="counter">
    <p class="counter__value">
      {{ count }} ({{ doubled }})
    </p>
    <button 
      class="counter__button"
      @click="increment"
    >
      Increment
    </button>
  </div>
</template>

<style scoped>
.counter {
  display: flex;
  gap: 1rem;
}

.counter__value {
  font-size: 1.2rem;
}

.counter__button {
  padding: 0.5rem 1rem;
}
</style>
```
