<script setup>
import {
    PagesIndexWelcomeMain as Welcome,
    PagesIndexLoginSignupForm as LoginSignup,
    ArchitecturePanelMain as Panel
} from '#components'

const { t, locale } = useI18n();

const messages = {
    underConstruction: {
        en: "Finds Table is currently in developement, you can learn about the project on the Finds Table Patreon page.  If you want to be a beta tester, visit the Discord server to request an invitation code ! ",
        fr: "Finds Table est en cours de développement, vous pouvez découvrir le projet en visitant la page Patreon.  Pour être tester beta, visitez le serveur Discord pour obteenir un code d'invitation."
    }
}

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
            <p class="underConstruction pad10 marTop20">
                {{ t('page.landing.patreonLink') }}
            </p>

            <div class="centered marTop20">
                <NuxtLink class="block comp-button -filled patreonLink flex alignCenter justifyCenter pointer"
                    to="https://www.patreon.com/Findstable" :external="true">
                    <img class="logo h100" src="/patreon/PATREON_SYMBOL_1_BLACK_RGB.png" alt="">
                    <img class="word h100" src="/patreon/PATREON_WORDMARK_1_BLACK_RGB.png" alt="">
                </NuxtLink>
            </div>

            <div class="centered marTop20">
                <NuxtLink class="block comp-button -filled patreonLink flex alignCenter justifyCenter pointer"
                    to="https://discord.gg/cAQG4Xcg2r" :external="true">
                    Serveur Discord
                </NuxtLink>
            </div>
        </Panel>
    </NuxtLayout>
</template>

<style scoped>
.underConstruction {
    background-color: var(--color-info-bg);
    border: 1px solid var(--color-info-border);
    border-radius: 5px;
}
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