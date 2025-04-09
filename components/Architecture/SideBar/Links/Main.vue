<script setup>
import { ArchitectureSideBarLinksButton as Button } from '#components'

const links = [
    { textPath: 'sideBarLinks.users', to: '/users', icon: null },
    { textPath: 'sideBarLinks.newFind', to: '/finds/new', icon: null},
    { textPath: 'sideBarLinks.finds', to: '/home?content=finds', icon: null },
    { textPath: 'sideBarLinks.thoughts', to: '/home?content=thoughts', icon: null },
    { textPath: 'sideBarLinks.badges', to: '/success-badges', icon: null },
    { textPath: 'sideBarLinks.notifications', to: '/notifications', icon: 'bell' }
]
</script>

<template>
    <div class="flex column gap5">
        <Button 
            v-for="(link, index) in links" :key="index"
            :to="link.to" 
            :textPath="link.textPath" 
        />
    </div>
</template>

<style scoped>
.comp-button {
    font-size: 1.3rem;
    font-weight: 700;
}
</style>