<template>
    <div class="scrollable">
        <div class="mainWidth">
            <slot />
        </div>
    </div>
</template>

<style scoped>
.scrollable {
    position: absolute;
    inset: 0;
    overflow-y: scroll;
}
.mainWidth {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 clamp(1rem, 5vw, 5rem);
    height: 2000px;
}
</style>