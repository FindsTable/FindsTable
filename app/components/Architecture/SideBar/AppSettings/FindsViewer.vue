<script setup>
const appState = useAppState()
const cardSizes = [
    {
        icon: 'cardsTiny',
        value: 'image'
    },
    {
        icon: 'cardsSmall',
        value: 'small'
    },
    {
        icon: 'cardsMedium',
        value: 'medium'
    },
    // {
    //     icon: 'cardsLarge',
    //     value: 'large'
    // }
]

function handleClick(value) {
    appState.value.findViewer.cardSize = value
}
</script>

<template>
    <div 
        class="box flex justifyEvenly alignCenter gap5"
    >
        <div 
            v-for="(size, index) in cardSizes" :key="index" 
            class="touch centered"
            :class="{
                active: useAppState().value.findViewer.cardSize === size.value
            }"
        >
            <Icon 
                :name="size.icon" 
                size="24px"
                class="pointer"
                @click="handleClick(size.value)"

            />
        </div>
    </div>
</template>

<style scoped>
.box {
    padding: 5px;
    border: 1px solid rgba(117, 117, 117, 0.473);
    border-radius: 5px;
}
.touch {
    padding: 5px;
    border-radius: 5px;
}
.active {
    background-color: rgba(61, 103, 86, 0.47);
}
.touch:hover {
    background-color: rgba(122, 122, 122, 0.47);
}
</style>