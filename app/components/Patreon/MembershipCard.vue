<script setup>
const me = useUserState()
const { t } = useI18n()

const { openModal } = useConfirmationModal()

async function unlink() {

    const confirmUnlink = await openModal({
        title: "Unlink Patreon account ?",
        message: "You will loose your benefits on Finds Table."
    })

    if(!confirmUnlink) return


    try {
        await $fetch(
            '/api/content/deleteItem',
            {
                method: 'DELETE',
                headers: {
                    authorization: `Bearer ${me.value.accessToken.value}`
                },
                body: {
                    collection: 'Patreon_accounts',
                    id: me.value.patreon_account.id
                }
            }
        )

        me.value.patreon_account = null

        useToaster('show', {
            id: 'accountUnlinked',
            message: t('success.patreon.account.unLinked'),
            type: 'success',
            autoClose: true,
            position: 'bottom'
        })
    } catch(err) {
        useHandleError(err)
    }
}
</script>

<template>
    <section v-if="me?.patreon_account?.id">
        <div class="idCard flex gap10">
            <img class="h100" :src="me.patreon_account.thumb_url" alt="">

            <div>
                <p class="font-text-large">
                    {{ me.patreon_account.full_name }}
                </p>

                <p class="font-text-large">
                    email: {{ me.patreon_account.email }}
                </p>
            </div>
        </div>

        <ul class="flex column gap10">
            <li class="marTop20 flex">
                <NuxtLink 
                    external="true" 
                    :to="me.patreon_account.url"
                    class="pointer flex alignCenter gap5 comp-button -outlined"
                >
                    <!-- <Icon name="openInNew" size="1em"/>     -->
                <span class="flex alignCenter">
                    {{ t('page.settings.tabs.patreon.sections.visityourAccount.button') }}
                </span>
                </NuxtLink>
            </li>

            <li class="flex marTop20">
                <button 
                    @click.stop.prevent="unlink"
                    class="unlinkButton comp-button -outlined"
                >
                    {{ t('page.settings.tabs.patreon.sections.unlink.button') }}
                </button>
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