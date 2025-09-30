<script setup>
import {
    PagesIndexWelcomeMain as Welcome,
    PagesIndexLoginSignupForm as LoginSignup,
    ArchitecturePanelMain as Panel
} from '#components'

definePageMeta({
    title: 'Finds Table | Login or signup',
    description: 'Finds Table, a place to show your share of history.',
    middleware: 'public-route',
});
</script>

<template>
    <NuxtLayout name="public-route">
        <Panel>
            <h1 class="font-findsTable-display">
                Finds Table
            </h1>
            
            <LoginSignup />
        </Panel>
    </NuxtLayout>
</template>