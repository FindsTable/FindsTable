<script setup lang="ts">
const model = defineModel<string>()

const props = defineProps({
    labelPath: String
})

const { t } = useI18n()

const inputRef = ref<HTMLInputElement>()

function openCalendar() {
  inputRef.value?.showPicker()
}


function formatDate(dateString: string) {
  if (!dateString) return ''
  const [year, month, day] = dateString.split('-')
  return `${day}-${month}-${year}`
}

</script>

<template>
<FormsLabel>
    <template #label>
        {{ t(`${labelPath}`) }}
    </template>
        
    <template #input>
        <div class="dateWrapper pointer customDateInput marTop10 allEvents" @click="openCalendar">
            <Icon name="datePrecise" size="28px" class="calendarIcon" />
            
            <div v-if="model" class="formattedDate">
                {{ formatDate(model)}}
            </div>

            <div v-else class="formattedDate">
                Select a date
            </div>

            <input
                ref="inputRef"
                type="date"
                v-model="model"
                class="dateInputHidden"
                aria-label="Select a date"
            />
        </div>
    </template>
</FormsLabel>
  <!-- <div class="flex column alignStart gap10">
    <TH2 class="sectionTitle">
        {{ t(`${labelPath}`) }}
    </TH2>

    <div class="dateWrapper pointer customDateInput" @click="openCalendar">
      <Icon name="datePrecise" size="28px" class="calendarIcon" />
      
      <div v-if="model" class="formattedDate">
        {{ formatDate(model)}}
      </div>

      <div v-else class="formattedDate">
        Select a date
      </div>

      <input
        ref="inputRef"
        type="date"
        v-model="model"
        class="dateInputHidden"
        aria-label="Select a date"
      />
    </div>
  </div> -->
</template>

<style scoped>
.dateWrapper {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 8px;
  background: var(--surface2-bgColor);
  cursor: pointer;
  min-height: 40px;
}

.calendarIcon {
  color: var(--textColor-main);
}

.formattedDate {
  font-weight: bold;
  font-size: 16px;
  color: var(--textColor-main);
}

/* Fully hide the input but keep it accessible */
.dateInputHidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
</style>
