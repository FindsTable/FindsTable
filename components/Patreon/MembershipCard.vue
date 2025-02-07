<script setup>
const user = useUserState()
const { t } = useI18n()
</script>

<template>
    <section v-if="user?.patreon_account?.id">
        <div class="idCard flex gap10">
            <img class="h100" :src="user.patreon_account.thumb_url" alt="">

            <div>
                <p class="font-text-large">
                    {{ user.patreon_account.full_name }}
                </p>

                <p class="font-text-large">
                    email: {{ user.patreon_account.email }}
                </p>
            </div>
        </div>

        <ul class="flex column gap10">
            <li class="marTop20 flex">
                <NuxtLink 
                    external="true" 
                    :to="user.patreon_account.url"
                    class="pointer flex alignCenter gap5 comp-button -outlined"
                >
                    <!-- <Icon name="openInNew" size="1em"/>     -->
                <span class="flex alignCenter">
                    {{ t('page.settings.tabs.patreon.sections.visityourAccount.button') }}
                </span>
                </NuxtLink>
            </li>

            <li class="flex marTop20">
                <NuxtLink 
                    class="unlinkButton comp-button -outlined"
                    to="/patreon/account/unlink">
                    {{ t('page.settings.tabs.patreon.sections.unlink.button') }}
                </NuxtLink>
            </li>
        </ul>
    </section>
</template>

<style scoped>
section {
    /* background-color: rgb(96, 64, 44); */
    padding: 10px;
}

.idCard {
    height: 3rem;
}
ul {
    list-style: none;
}
.unlinkButton {
    background-color: var(--color-error);
}
</style>