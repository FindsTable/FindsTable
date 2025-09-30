<template>
    <div class="spinner relative theme-textColor-main">
        <div class="absolute full border-round" />
    </div>
</template>

<style scoped>
.spinner {
    width: 40px;
    height: 40px;
}

.spinner div {
    border: 3px solid;
    border-color: currentColor transparent transparent transparent;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>
