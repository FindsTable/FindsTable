<!-- 
 
Creates a scollable container in a flex-growing element.

--- !!!!   NEEDS A FLEX COLUMN PARENT !!!! ---

-->

<template>
    <div class="relative w100 grow">
        <div class="scroller absoluteFull">
            <slot />
        </div>
    </div>
</template>

<style scoped>
.scroller {
    overflow-y: scroll;
    overflow-x: hidden;
}

</style>