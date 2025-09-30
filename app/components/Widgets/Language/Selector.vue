<script setup>
const { t, locale, locales, setLocale } = useI18n()
const preferredLocaleCookie = useCookie('preferredLocale');

function handleClick(code) {
    setLocale(code)
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
    <div class="selectorBox flex alignCenter">
        <!-- <NuxtLink v-for="loc in locales" :key="loc.code" @click="handleClick(loc.code)" :to="switchLocalePath(loc.code)"
            class="comp-button-square centered"
            :class="[ loc.code === locale ? 'comp-button-filled' : 'comp-button -text']">
            <span class="semibold centered pointer">
                {{ loc.code }}
            </span>
        </NuxtLink> -->

        <button 
            v-for="loc in locales" :key="loc.code" 
            @click="handleClick(loc.code)"
            class="
                comp-button-square
                centered
            " 
            :class="[loc.code === locale ? 'comp-button-filled' : 'comp-button -text']"
        >

            <span class="semibold centered pointer">
                {{ loc.code }}
            </span>
        </button>
    </div>
</template>

<style scoped>
.selectorBox {
    height: 100%;
}

span {
    width: 30px;
    height: 30px;
    font-size: 0.875rem;
}

</style>