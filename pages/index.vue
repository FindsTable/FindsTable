<script setup>
import {
    PagesIndexWelcomeMain as Welcome,
    PagesIndexLoginSignupForm as LoginSignup,
    ArchitecturePanelMain as Panel
} from '#components'
const { t } = useI18n();

definePageMeta({
    title: 'Finds Table',
    description: 'Finds Table, a place to show your share of history.',
    middleware: 'public-route',
});
</script>

<template>
    <NuxtLayout name="public-route">
        <Panel>
            <Welcome />

            <div class="centered marTop50">
                <NuxtLink to="/login" 
                    class="
                        comp-button -bold -large -filled 
                        pointer 
                    ">
                    <span class="bold">
                        {{ t('page.landing.loginButton') }}
                    </span>
                </NuxtLink>
            </div>
        </Panel>

        <Panel>
            <p>
                {{ t('page.landing.patreonLink') }}
            </p>

            <div class="centered marTop20">
                <NuxtLink class="block comp-button -text patreonLink flex alignCenter justifyCenter pointer"
                    to="https://www.patreon.com/Findstable" external="true">
                    <img class="logo r h100" src="/patreon/PATREON_SYMBOL_1_BLACK_RGB.png" alt="">
                    <img class="word h100" src="/patreon/PATREON_WORDMARK_1_BLACK_RGB.png" alt="">
                </NuxtLink>
            </div>
        </Panel>
    </NuxtLayout>
</template>

<style scoped>
.patreonLink {
    height: 20px;
    padding: 10px 18px;
    transition: ease-in-out 0.2s;
}
.patreonLink .logo{
    width: 18px;
}
.patreonLink .word {
    width: 72px;
}
#app.dark img {
    filter: invert();
}
</style>