<script setup>

const props = defineProps({
    patreonAccount: Object
})

</script>

<template>
    <div
        v-if="patreonAccount"
        class="patreonFrame"
        :class="[
            patreonAccount?.tier?.frontEndClass ? patreonAccount.tier.frontEndClass : ''
        ]"
    >
        <div class="relative">
            <slot name="avatar">

            </slot>

            <img
                v-if="patreonAccount?.tier"
                :src="`https://admin.findstable.net/assets/${patreonAccount.tier.badgeFile}?key=badge-h50-q100-png`" alt="" class="patreonBadge"
            >
        </div>

        <div 
            v-if="patreonAccount?.tier?.title"
            class="
                marTop20 
                flex justifyCenter 
                typeface-fraunces -small
                tierTitle
            ">
            {{ patreonAccount.tier.title }}
        </div>
    </div>
</template>

<style scoped>
.patreonFrame {
    padding: 5px;
    border-radius: 15px;
}
.patreonFrame {
    background-color: rgb(129, 129, 129);
}
.patreonFrame.level1 {
    border: 1px solid rgb(52, 105, 125);
    box-shadow: inset 0 0 10px rgba(52, 105, 125, 0.711),
    0 0 10px rgba(28, 28, 28, 0.683);
}
.patreonFrame.level2 {
    border: 1px solid rgb(98, 60, 128);
    box-shadow: inset 0 0 10px rgba(97, 79, 110, 0.683),
    0 0 10px rgba(28, 28, 28, 0.683);
}
.patreonFrame.level3 {
    border: 1px solid rgb(147, 173, 51);
    box-shadow: inset 0 0 10px rgba(49, 111, 38, 0.683),
    0 0 10px rgba(28, 28, 28, 0.683);
}
.patreonFrame.sponsor1 {
    border: 1px solid rgb(147, 73, 68);
    box-shadow: inset 0 0 10px rgba(149, 66, 65, 0.683),
    0 0 10px rgba(28, 28, 28, 0.683);
}
.patreonFrame.sponsor2 {
    border: 1px solid rgb(120, 77, 152);
    box-shadow: inset 0 0 10px rgba(93, 130, 186, 0.683),
    0 0 10px rgba(28, 28, 28, 0.683);
}
.patreonFrame.sponsor3 {
    border: 1px solid rgb(60, 110, 128);
    box-shadow: inset 0 0 10px rgba(88, 98, 185, 0.805),
    0 0 10px rgba(28, 28, 28, 0.683);
}
.patreonBadge {
    height: 22px;
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translate(-50%,40%);
}
.tierTitle {
    color: white;
}
</style>