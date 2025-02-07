<script setup>
const userContent = useUserContent()
const props = defineProps({
    badge: Object,
    selected: Boolean
})

const emit = defineEmits(['selectBadge'])

const versionId = computed( () => {
    if(!userContent.value.badgeRecord) {
        return props.badge.level1
    }
    return props.badge[userContent.value.badgeRecord[props.badge.key]]
})

const owned = computed(() => {
    if(!userContent.value.badgeRecord) {
        return false
    }
    if(!userContent.value.badgeRecord[props.badge.key]) {
        return false
    } else {
        return true
    }
})
function handleClick() {
    emit('selectBadge', props.selected ? '' : props.badge.key)
}

</script>

<template>
    <div 
        class="frame pointer"
        :class="[ selected ? 'selected' : '', owned ? 'owned' : 'notOwned' ]"
        @click="handleClick"
    >
        <div class="drawer relative h100">
            <div class="flex column alignCenter">
                <div class="w100 flex justifyEnd">
                    <Icon name="info" size="20px"/>
                </div>

                <img 
                    :src="`https://admin.findstable.net/assets/${versionId || badge.level1}?key=badge-h150-q100-png`" alt=""
                >
                <p class="badgeName -bold marTop20 flex justifyCenter" v-if="badge.translations[0]">
                    {{ badge.translations[0].name }}
                </p>
            </div>

            <div class="descriptionBox flex column absolute full">
                <div class="flex justifyStart">
                    <Icon name="back" size="20px" />
                </div>

                <p class="grow flex alignCenter" v-if="badge.translations[0]">
                    {{ badge.translations[0].description }}
                </p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.frame {
    border-radius: 10px;
    overflow: hidden;
    /* background-color: var(--tone-grayscale-30); */
}
.frame.selected .drawer{
    transform: translateX(-100%);
    
}
.drawer {
    padding: 20px;
    transition: 300ms ease;
}
.descriptionBox {
    top: 0;
    left: 100%;
    padding: 20px;
    text-align: center;
    line-height: 1.6rem;
}
.badgeName {
    width: 150px;
    text-align: center;
}
img {
    height: 150px;
}
.frame{
    border: 1px solid rgb(62, 110, 71);
    box-shadow: inset 0px 0px 10px rgba(62, 110, 71, 0.542);
    transition: 300ms ease;
}
.frame:hover {
    border: 1px solid rgb(84, 155, 97);
    box-shadow: inset 0px 0px 15px rgba(105, 181, 119, 0.543);
}

.notOwned{
    filter: saturate(0);
    /* border: 1px solid rgb(116, 116, 116);
    box-shadow: inset 0px 0px 10px rgba(107, 107, 107, 0.542); */
}
.notOwned img{
    filter: saturate(0) brightness(0.8);
}
</style>