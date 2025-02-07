<script setup>
const userState = useUserState();

const showSelector = ref(false);
</script>

<template>
    <div class="frame centered">
        <Icon name="account" />
    </div>

    <button class="mainTC pointer" @click="showSelector = !showSelector">
        changer d'avatar
    </button>

    <WidgetsAvatarSelector v-if="showSelector" />
</template>

<style scoped>
.frame {
    width: 150px;
    height: 150px;
    background-color: var(--main-dimmed);
    padding: 10px;
    border-radius: 10px;
}

.dimmed {
    opacity: 0.3;
}
</style>

