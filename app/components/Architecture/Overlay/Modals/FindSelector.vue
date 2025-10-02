<script setup lang="ts">
import { ContentFindsCardSmall } from '#components'

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
            console.log(res)
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
    <div class="h100 flex column">
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

        <ArchitectureFlexGrowVerticalScroll
            class="marTop20"
        >
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
                class="grow findScroller flex wrap"
            >
                <div 
                    v-for="find in finds" 
                    :key="find.id"
                    class="w50 pad5"
                >
                    <div 
                        class="findBox pointer r w100 r"
                        :class="{ selected: isSelected(find.id) }"
                        @click="toggleFind(find.id)"
                    >
                        <ContentFindsCardSmall
                            :find="find"
                        /> 
                    </div> 
                </div>
            </div>
        </ArchitectureFlexGrowVerticalScroll>
    </div>
</template>

<style scoped>

.buttonsRow {
    justify-content: center;
    gap: 10px;
}

.findsScroller {
    overflow-y: auto;
}

.findBox {
    border: 2px solid transparent;
    border-radius: 10px;
    transition: 200ms;
    overflow: hidden;
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
