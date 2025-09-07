<script setup lang="ts">
import { ArchitectureAppBox as AppBox } from '#components'

const { t } = useI18n()
const userState = useUserState()

const props = defineProps({
    error: Object
})

useHead({
    title: `Error ${props.error?.statusCode || 'Unknown'} | FindsTable`,
    meta: [
        { name: 'description', content: 'An error occurred' }
    ]
})

const errorMessage = computed(() => {
    if (!props.error) {
        return t('error.unknown')
    }
    
    switch (props.error.statusCode) {
        case 404:
            return t('error.notFound')
        case 403:
            return t('error.forbidden')
        case 500:
            return t('error.server')
        default:
            return props.error.message || t('error.unknown')
    }
})

function handleReturn() {
    clearError()
    navigateTo('/')
}

const isLoggedIn = computed(() => userState.value?.id)

definePageMeta({
    layout: false
})
</script>

<template>
    <AppBox>
        <template #content>
            <!-- Use appropriate layout based on auth state -->
            <NuxtLayout :name="isLoggedIn ? 'private-route' : 'public-route'">
                <!-- Title slot for private layout -->
                <template #title>
                    Error {{ error?.statusCode || 'Unknown' }}
                </template>

                <template #scrollMain>
                    <div class="grow">
                    <!-- Main content for both layouts -->
                    <div class="full flex column alignCenter justifyCenter grow gap20">
                    <!-- Error icon -->
                        <div class="error-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--main-text-color)" stroke-width="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                        </div>
                
                        <!-- Error message -->
                        <p class="error-message">
                            {{ errorMessage }}
                        </p>
                    
                        <!-- Action buttons -->
                        <div class="flex gap10 marTop20">
                            <button 
                                class="comp-button -filled"
                                @click="handleReturn"
                            >
                                Return to Home
                            </button>
                            
                            <button 
                                v-if="error?.statusCode === 404"
                                class="comp-button -outlined"
                                @click="navigateTo('/settings')"
                            >
                                Go to Settings
                            </button>
                        </div>
                    </div>
                    </div>
                </template>
                

                <!-- Technical details in scrollMain slot for private layout -->
                <!-- <template #scrollMain v-if="isLoggedIn">
                    <details class="error-details theme-surface-2 w100">
                        <summary class="theme-textColor-main">Technical Details</summary>
                        <pre class="theme-textColor-dimmed">{{ error }}</pre>
                    </details>
                </template> -->
            </NuxtLayout>
        </template>
    </AppBox>
</template>

<style scoped>
.error-container {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
    min-height: 60vh;
}

.error-icon {
    font-size: 64px;
    color: var(--main-text-color);
    opacity: 0.7;
}

.error-message {
    color: var(--main-text-color);
    font-size: 1.2rem;
    text-align: center;
    margin: 1rem 0;
}

.error-details {
    padding: 10px;
    border-radius: 8px;
    margin-top: 20px;
    cursor: pointer;
    border: 1px solid var(--panel-border);
    background-color: var(--main-background-color);
}

.error-details summary {
    padding: 8px;
    font-weight: bold;
    color: var(--main-text-color);
}

.error-details pre {
    padding: 10px;
    overflow: auto;
    font-family: monospace;
    font-size: 14px;
    white-space: pre-wrap;
    color: var(--main-dimmed);
}
</style>