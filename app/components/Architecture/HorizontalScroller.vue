<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

defineProps<{
  gap?: number
}>()

const showArrows = ref(false)

// Detect if device has mouse
onMounted(() => {
  const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
  showArrows.value = mediaQuery.matches
  
  // Update if device changes (e.g., tablet with mouse connected)
  mediaQuery.addEventListener('change', e => {
    showArrows.value = e.matches
  })
})

const container = ref<HTMLElement | null>(null)
const currentIndex = ref(0)
const totalSlides = ref(0)

// Calculate total slides and update when slot content changes
const updateTotalSlides = () => {
  if (container.value) {
    totalSlides.value = container.value.children.length
  }
}

// Update current index based on scroll position
const updateCurrentIndex = () => {
  if (container.value) {
    const itemWidth = container.value.firstElementChild?.clientWidth || 0
    currentIndex.value = Math.round(container.value.scrollLeft / itemWidth)
  }
}

// Set up observers
onMounted(() => {
  updateTotalSlides()
  updateCurrentIndex()
  
  // Watch for changes in the slot content
  const observer = new MutationObserver(() => {
    updateTotalSlides()
    updateCurrentIndex()
  })
  
  if (container.value) {
    observer.observe(container.value, { childList: true })
    container.value.addEventListener('scroll', updateCurrentIndex)
  }
})

// Navigate to a specific slide
const goToSlide = (index: number) => {
  if (!container.value) return
  if (index < 0 || index >= totalSlides.value) return
  
  const itemWidth = container.value.firstElementChild?.clientWidth || 0
  container.value.scrollLeft = itemWidth * index
  currentIndex.value = index
}
</script>

<template>
    <div 
        class="
            scrollerWrapper 
            relative
            flex alignCenter
            full
    ">
        <!-- Previous Button -->
        <button 
            v-if="showArrows && totalSlides > 1" 
            class="navButton prev pointer" 
            @click.stop.prevent="goToSlide(currentIndex - 1)"
            :disabled="currentIndex === 0"
            aria-label="Previous slide"
        >
            <Icon name="arrowLeft" />
        </button>

        <div 
            ref="container"
            class="
                scrollerContainer 
                full
                flex
            "
            :style="{ gap: `${gap}px` }"
        >
            <slot />
        </div>

        <!-- Next Button -->
        <button 
            v-if="showArrows && totalSlides > 1" 
            class="navButton next pointer" 
            @click.stop.prevent="goToSlide(currentIndex + 1)"
            :disabled="currentIndex === totalSlides - 1"
            aria-label="Next slide"
        >
            <Icon name="arrowRight" />
        </button>

        <!-- Navigation Dots -->
        <div v-if="totalSlides > 1" class="navigationDots">
            <button
                v-for="index in totalSlides"
                :key="index"
                class="dot"
                :class="{ active: currentIndex === index - 1 }"
                @click.stop.prevent="goToSlide(index - 1)"
                :aria-label="`Go to slide ${index}`"
            />
        </div>
    </div>
</template>

<style scoped>
.scrollerWrapper {
    isolation: isolate;
}
.scrollerContainer {
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  touch-action: pan-x pan-y pinch-zoom; /* Allow both horizontal and vertical scroll */
  flex: 1;
  position: relative; /* For proper stacking context */
    
}

.navButton {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 1;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navButton:hover {
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.navButton:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.navButton.prev {
  left: 0.5rem;
}

.navButton.next {
  right: 0.5rem;
}

.scrollerContainer::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}

.scrollerContainer:active {
  cursor: grabbing;
}

.scrollerContainer > * {
  flex-shrink: 0;
  scroll-snap-align: start;
  scroll-snap-stop: always;
  pointer-events: none;
  user-select: none; 
}

.navigationDots {
  position: absolute;
  bottom: 0.5rem;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem;
  z-index: 2; /* Ensure dots are above content */
  pointer-events: auto; /* Re-enable pointer events for dots */
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.3);
  border: none;
  padding: 0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.dot:hover {
  background: rgba(0, 0, 0, 0.5);
}

.dot.active {
  background: white;
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 1);
  transform: scale(1.2);
}
</style>
