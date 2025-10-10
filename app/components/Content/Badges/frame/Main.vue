<script setup lang="ts">
const { t, locale } = useI18n()
const props = defineProps<{
  badge: any
  selected: Boolean
  owned: any
}>();


// {{ badges[0].tiers[0].badgeValues[0].tier.image }}

const imageId = computed(() => {
    const ownedImage = props.badge?.tiers?.[0]?.badgeValues?.[0]?.tier?.image
    return ownedImage || props.badge?.defaultTier?.image
})

</script>

<template>
    <div 
        v-if="badge"
        class="frame pointer"
        :class="[ 
            selected ? 'selected' : '', 
            owned ? 'owned' : 'notOwned'
        ]"
    >
        <div class="drawer relative h100">
            <div class="flex column alignCenter">
                <div class="w100 flex justifyEnd">
                    <Icon name="info" size="20px"/>
                </div>

                <img 
                    :src="`https://admin.findstable.net/assets/${imageId}`" alt=""
                >
            </div>

            <div class="descriptionBox flex column absolute full">
                <div class="flex justifyStart">
                    <Icon name="back" size="20px" />
                </div>

                <p class="grow flex alignCenter" v-if="badge.description">
                    {{ badge.description[locale] }}
                </p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.frame {
    border-radius: 10px;
    overflow: hidden;
    background-color: rgba(0, 0, 0, 0.16);
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
    box-shadow: inset 0px 0px 10px rgba(85, 143, 95, 0.542);
    transition: 300ms ease;
}
.frame:hover {
    border: 1px solid rgb(84, 155, 97);
    box-shadow: inset 0px 0px 15px rgba(105, 181, 119, 0.543);
}

.notOwned{
    box-shadow: inset 0px 0px 10px rgba(85, 143, 95, 0.235);
    filter: saturate(0);
    /* border: 1px solid rgb(116, 116, 116);
    box-shadow: inset 0px 0px 10px rgba(107, 107, 107, 0.542); */
}
.notOwned img{
    filter: saturate(0) brightness(0.8);
}
</style>