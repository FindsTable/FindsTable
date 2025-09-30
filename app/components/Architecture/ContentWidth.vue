<script setup>
defineProps({
    full: {
        type: Boolean,
        default: false
    },
    large: {
        type: Boolean,
        default: false
    },
    medium: {
        type: Boolean,
        default: false
    },
    small: {
        type: Boolean,
        default: false
    },
    scrollable: {
        type: Boolean,
        default: false
    }
})
</script>

<template>
    <div
        :class="[
            full ? 'fullContentWidth' : '',
            large ? 'largeContentWidth' : '',
            medium ? 'mediumContentWidth' : '',
            small ? 'smallContentWidth' : '',
                scrollable ? 'scrollable' : ''
        ]">
        <slot />
    </div>
</template>

<style scoped>
div {
    padding: 20px;
}
.fullContentWidth {
    width: 100%;
}
.largeContentWidth {
    width: min(100%, 1200px);
}
.mediumContentWidth {
    width: min(100%, 800px);
}
.smallContentWidth {
    width: min(100%, 400px);
}
.scrollable {
    overflow: scroll;
}
/* 
Elements in a flex-growing container will grow when content overflows.
To avoid this, we use absolute positioning.
*/
.grow > .scrollable {
    position: absolute;
    height: 100%;
    left: 50%;
    transform: translateX(-50%);
    padding-right: 15px;
}
</style>