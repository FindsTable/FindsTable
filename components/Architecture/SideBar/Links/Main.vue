<script setup>
import { ArchitectureSideBarLinksButton as Button } from '#components'

const links = [
    { textPath: 'Users', to: '/users', icon: null },
    { textPath: 'New find', to: '/finds/new', icon: null},
    { textPath: 'All finds', to: '/home?content=finds', icon: null },
    { textPath: 'Thoughts', to: '/home?content=thoughts', icon: null },
    { textPath: 'Badges', to: '/success-badges', icon: null }
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