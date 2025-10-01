# CSS Guide

## Project Structure

The CSS in this project is organized into several key areas:

```
app/css/
├── _styles_.css          # Main entry point
├── architecture.css      # Layout structures
├── base.css             # Base styles
├── colors.css           # Color variables
├── forms.css           # Form styles
├── pageStructure.css   # Page layout
├── posoroko.css        # Utility classes
├── typography.css      # Typography styles
├── colors-and-themes/  # Theme system
│   └── themes/
│       ├── light.css
│       ├── dark.css
│       ├── coffee.css
│       └── forest.css
└── components/         # Component-specific styles
    ├── buttons/
    ├── forms/
    └── panels/
```

## Theme System

### Available Themes
- Light (default)
- Dark
- Coffee
- Forest

### Theme Classes
```css
.theme-backdropColor      /* Background color */
.theme-surface1         /* Primary surface */
.theme-surface-2         /* Secondary surface */
.theme-titleColor-main   /* Main title color */
.theme-textColor-main    /* Main text color */
.theme-textColor-dimmed  /* Dimmed text */
```

### Usage
```html
<div class="theme-surface1">
  <h1 class="theme-titleColor-main">Title</h1>
  <p class="theme-textColor-main">Content</p>
</div>
```

## Utility Classes

### Layout
```css
/* Dimensions */
.full          /* width: 100%; height: 100% */
.w100          /* width: 100% */
.h100          /* height: 100% */
.w50, .w40     /* width: 50%, 40% */
.h100vh        /* height: 100vh */

/* Display */
.block         /* display: block */
.inline        /* display: inline */
.inlineBlock   /* display: inline-block */
.inlineFlex    /* display: inline-flex */

/* Flex */
.flex          /* display: flex */
.column        /* flex-direction: column */
.row           /* flex-direction: row */
.wrap          /* flex-wrap: wrap */
.justifyCenter /* justify-content: center */
.alignCenter   /* align-items: center */
.grow          /* flex-grow: 1 */
.shrink        /* flex-shrink: 1 */

/* Spacing */
.gap5 to .gap50    /* gap: 5px to 50px */
.marTop5 to .marTop50  /* margin-top */

/* Position */
.relative      /* position: relative */
.absolute      /* position: absolute */
.fixed         /* position: fixed */
.absoluteFull  /* Fills parent container */
```

## Component-Based CSS

### Guidelines

1. Each component should have its scoped styles when needed:
```vue
<style scoped>
.componentName {
  /* styles */
}
</style>
```

2. Use theme classes for colors:
```vue
<template>
  <div class="theme-surface1">
    <h2 class="theme-titleColor-main">Title</h2>
  </div>
</template>
```

3. Use utility classes for layout:
```vue
<template>
  <div class="flex column gap20">
    <div class="w100 flex justifyBetween">
      <!-- content -->
    </div>
  </div>
</template>
```

## Forms

Form elements have standardized styles in `forms.css`:

```css
.comp-inputText       /* Text input styles */
.comp-button         /* Button styles */
.comp-forms-switch   /* Switch component */
```

## Best Practices

1. **Theme Usage**
   - Always use theme classes for colors
   - Never hardcode colors in component styles
   - Use CSS variables for custom colors

2. **Layout**
   - Use utility classes for common layouts
   - Avoid custom margins/padding when possible
   - Use gap classes for spacing

3. **Component Styles**
   - Keep component-specific styles scoped
   - Use BEM naming for component classes
   - Prefix component classes (e.g., `comp-`)

4. **Responsive Design**
   - Use relative units (rem, em, %)
   - Mobile-first approach
   - Use CSS Grid and Flexbox

5. **Performance**
   - Minimize nested selectors
   - Avoid !important
   - Use efficient selectors

## Deprecated Features

Some CSS features are being phased out:
- Old component styles in `_styles_.css`
- Direct color values (use theme system)
- Complex nested selectors
- Non-scoped styles

## Examples

### Layout Component
```vue
<template>
  <div class="theme-surface1 flex column gap20">
    <header class="flex justifyBetween alignCenter">
      <h1 class="theme-titleColor-main">Title</h1>
      <nav class="flex gap10">
        <!-- navigation -->
      </nav>
    </header>
    <main class="grow overflowScroll">
      <!-- content -->
    </main>
  </div>
</template>

<style scoped>
/* Component-specific styles only */
</style>
```

### Form Component
```vue
<template>
  <form class="flex column gap20">
    <div class="comp-forms-input">
      <input class="comp-inputText" />
    </div>
    <button class="comp-button">Submit</button>
  </form>
</template>
```

## Migration Guide

When updating old components:
1. Remove direct color values
2. Replace with theme classes
3. Use utility classes for layout
4. Scope all component-specific styles
5. Remove deprecated class usage
