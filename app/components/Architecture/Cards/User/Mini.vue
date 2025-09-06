<script setup>
const props = defineProps({
    userId: String,
    avatarId: String,
    username: String,
    date: String
})
</script>

<template>
    <!-- <NuxtLink :to="`/users/${userId}`" class="flex alignEnd gap20 pointer">
        <ArchitectureFramesAvatar :fileId="avatarId" round width="40px" />

        <p class="flex column">
            <span class="font-text -main -bold">
                {{ username }}
            </span>

            <span class="font-text -tiny">
                {{ date }}
            </span>
        </p>
    </NuxtLink> -->
</template>