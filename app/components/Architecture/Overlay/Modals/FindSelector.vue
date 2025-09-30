<script setup lang="ts">
const { confirm, cancel } = useModal()

const model = defineModel<string[]>()

const props = defineProps({
    maxSelect: {
        type: Number,
        default: 10
    }
})

const me = useUserState()

const domInfoMessage = ref('')

const { 
    response: finds, 
    isPending,
    error
} = useDirectAsyncFetch(
    'GET', '/items/Finds', 
    {
        query: useModalState().value.data.query,
        onResponse: (res) => {
            domInfoMessage.value = res.length === 0 ? 'You have no finds yet' : ''
        }
    }
)
function toggleFind(findId: string) {
    if (!Array.isArray(model.value)) {
        model.value = []
    }

    if (model.value.includes(findId)) {
        model.value = model.value.filter(id => id !== findId) // remove
    } else {
        if (model.value.length >= props.maxSelect) return
        model.value = [...model.value, findId] // add
    }
}

function isSelected(findId: string) {
    return model.value?.includes(findId)
}

function clearSelection() {
    model.value = []
}

function handleConfirm() {
    confirm(model.value)
}

function handleCancel() {
    cancel()
}
</script>

<template>
    <div class="findSelectorModal flex column fullHeight">
        <div class="buttonsRow flex gap10">
            <button 
                @click="handleConfirm" 
                class="comp-button -filled"
            >
                    Confirm
            </button>

            <button 
                @click="handleCancel" 
                class="comp-button -text"
            >
                Cancel
            </button>

            <button 
                @click="clearSelection" 
                class="comp-button -text"
            >
                Clear
            </button>
        </div>

        <div class="findsScroller grow scrollY marTop20">
            <div 
                v-if="domInfoMessage" 
                class="loadingState"
            >
                {{ domInfoMessage }}
            </div>

            <div 
                v-if="isPending" 
                class="loadingState"
            >
                Loading your finds...
            </div>

            <div 
                v-if="finds?.length" 
                class="flex wrap gap10"
            >
                <div 
                    v-for="find in finds" 
                    :key="find.id"
                    class="findBox pointer"
                    :class="{ selected: isSelected(find.id) }"
                    @click="toggleFind(find.id)"
                >
                    <img 
                        v-if="find.images?.length"
                        :src="`${useAppConfig().directusUrl}/assets/${find.images[0].directus_files_id}`"
                        class="objectFitCover"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.findSelectorModal {
    width: 100%;
    max-width: 600px;
    padding: 20px;
}

.buttonsRow {
    justify-content: center;
    gap: 10px;
}

.findsScroller {
    flex-grow: 1;
    overflow-y: auto;
}

.findBox {
    width: 100px;
    aspect-ratio: 1;
    border: 2px solid transparent;
    border-radius: 8px;
    overflow: hidden;
    transition: 200ms;
}

.findBox.selected {
    border-color: var(--titleColor-main);
    background-color: var(--surface2-bgColor);
}

.loadingState {
    text-align: center;
    font-size: 14px;
    color: var(--textColor-dimmed);
}
</style>
