<script setup>
const { t, locale, availableLocales } = useI18n()
const preferredLocaleCookie = useCookie('preferredLocale');

function handleClick(code) {
    locale.value = code

    preferredLocaleCookie.value = code

    useToaster(
        "show",
        {
            id: "languageOnIndexPage",
            messagePath: `${t("success.language.changedTo")} ${t(`languages.${code}.name`)}`,
            type: "success",
            autoClose: true,
            position: "bottom"
        }
    )
}

</script>

<template>
    <div class="selectorBox flex alignCenter gap20">
        <button 
            v-for="loc in availableLocales" :key="loc.code" 
            @click="handleClick(loc)"
            class="
                theme-mainActionButton
                centered
                pointer
            " 
            :class="[loc === locale ? '-on' : '-off']"
        >

            <span class="semibold centered">
                {{ loc }}
            </span>
        </button>
    </div>
</template>

<style scoped>
.selectorBox {
    padding: 8px 0;
}
button {
    height: 36px;
    aspect-ratio: 1/1;
    padding: 6px;
    border-radius: 4px;
}

</style>