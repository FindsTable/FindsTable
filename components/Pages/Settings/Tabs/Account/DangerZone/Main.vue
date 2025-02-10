<script setup>
import { 
    FormsFieldset,
    ArchitecturePageSectionsH2Panel as H2Panel,
    WidgetsDevToolsNoteToBetaUsers
} from '#components';

const  { t } = useI18n()
const me = useUserState()

const unsubscribeConfirmInput = ref('')

async function unsubscribe() {
    const res = await useNuxtApp().$users.deleteById({
        id: me.value.id,
        username: me.value.username,
        confirmation: unsubscribeConfirmInput.value
    })

    if(res?.ok) {
        navigateTo('/')
    }
}

</script>

<template>
    <H2Panel class="dangerBg">
        <template #H2>
            <div class="flex alignCenter gap10">
                <Icon name="warning" />
                <span>
                    Danger zone
                </span>
                </div>

        </template>

        <template #content>
            <form>
                <p class="font-pageLead marTop20">
                    Delete your account
                </p>

                <div class="flex column gap30 marTop10">
                    If you delete your account, all your content and informations will be permanently deleted.
                </div>

                <p class="font-text -main marTop20">
                    <span>
                        Type the following text :
                    </span>

                    <span class="-bold">
                        {{ me.username }}
                    </span>
                </p>

                <input 
                    class="
                        unsubscribeConfirmInput 
                        w100 marTop10
                        font-text -big theme-textColor-main
                    " 
                    type="text" 
                    v-model="unsubscribeConfirmInput" 
                    :placeholder="me.username"
                />

                <WidgetsDevToolsNoteToBetaUsers>
                    Pour l'instant, en supprimant un compte, toutes les données sont supprimées.
                    Plus tard, le compte sera d'abord mis en pause, psui supprimé au bout d'un mois.
                </WidgetsDevToolsNoteToBetaUsers>

                <button class="
                        comp-button -text font-text -main -bold
                        marTop10
                    " :disabled="unsubscribeConfirmInput !== me.username" @click.prevent="unsubscribe">
                    unsubscribe
                </button>
            </form>
        </template>
    </H2Panel>
</template>

<style scoped>
.dangerBg {
    background-color: rgb(74, 40, 40);
}
.unsubscribeConfirmInput {
    border-radius: 8px;
    border: 1px solid var(--ui-color-dimmed);
    padding: 6px 12px;
}
.unsubscribeConfirmInput:focus {
    border: 1px solid var(--ui-color-main);
}
</style>