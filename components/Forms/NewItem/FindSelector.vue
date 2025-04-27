<script setup lang="ts">
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
    query: {
        filter: {
            owner: {
                _eq: me.value.id
            }
        },
        sort: '-date_created', // latest finds first
        fields: [
            '*',
            'owner',
            'owner.id',
            'owner.displayName',
            'owner.username',
            'date_created',
            'date_lastEvent',
            'date_updated',
            'images.*',
            'likes.*',
            'likes_count',
            'comments.*'
        ],
        limit: 100
    },
    onRequest: () => {
        console.log('eric', me.value.id)
    },
    onResponse: (res) => {
        if(res.length === 0) {
            domInfoMessage.value = 'You have no finds yet'
        } else {
            domInfoMessage.value = ''
        }
    }
  }
)

function toggleFind(findId: string) {
    if (!model.value) model.value = []

    const index = model.value.indexOf(findId)
    if (index !== -1) {
        // Unselect
        model.value.splice(index, 1)
    } else {
        if (model.value.length >= props.maxSelect) {
        return
        }

        model.value = [...model.value, findId]
    }
}

function isSelected(findId: string) {
  return model.value?.includes(findId)
}

</script>

<template>
  <div class="flex column gap10 marTop10">
    <div v-if="domInfoMessage" class="loadingState">
      {{ domInfoMessage }}
    </div>

    <div v-if="isPending" class="loadingState">
        Loading your finds...
    </div>

    <div v-if="finds?.length" class="flex">
        <div 
            v-for="find in finds" 
            :key="find.id"
            class="findBox pointer"
            :class="{ selected: isSelected(find.id) }"
            @click="toggleFind(find.id)"
        >
        <img 
            :src="`${useAppConfig().directusUrl}/assets/${find.images[0].directus_files_id}`"
            class="objectFitCover"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>

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
