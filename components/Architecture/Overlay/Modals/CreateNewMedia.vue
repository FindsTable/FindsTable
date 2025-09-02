<script setup>
const { cancel } = useModal()

</script>

<template>
    <div
        class="flex column fullHeight gap10"
    >
        
        <NuxtLink
            to="/finds/new"
            class="option comp-button -shaped"
            @click="cancel"
        >
            {{ 
                useLocaleText({
                    fr: 'nouvelle trouvaille', 
                    en: 'new find'
                }) 
            }}

            <Icon name="content" size="22px" />
        </NuxtLink>

        
        <NuxtLink
            to="/hunt-reports/new"
            class="option comp-button -shaped"
            @click="cancel"
        >
            {{ 
                useLocaleText({
                    fr: 'nouvelle excursion', 
                    en: 'new hunt report'
                }) 
            }}

            <Icon name="book" size="22px" />
        </NuxtLink>
    </div>
</template>

<style scoped>
.option {
    display: flex;
    gap: 10px;
    align-items: center;
    cursor: pointer;
}
</style>