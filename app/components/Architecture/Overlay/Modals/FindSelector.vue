<script setup lang="ts">
import { ContentFindsCardSmall } from '#components'

const { confirm, cancel } = useModal()

const model = defineModel<any[]>()

const props = defineProps({
    maxSelect: {
        type: Number,
        default: 10
    }
})

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

function toggleFind(find: any) {
    if (!Array.isArray(model.value)) {
        model.value = []
    }

    if (model.value.some( (f) => f.id === find.id)) {
        
        // remove find when already selected
        model.value = model.value.filter((f) => f.id !== find.id)
        console.log(model.value)
        return
    } 
    
    // add find to selected array
    model.value = [...model.value, find]
    console.log(model.value)
}

function isSelected(findId: any) {
    return model.value?.some( (f) => f.id === findId)
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
                        @click="toggleFind(find)"
                    >
                        <ContentFindsCardSmall
                            :find="find"
                            class="pointer"
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
