<script setup>
const props = defineProps({
  albums: {
    type: Array,
    default: () => []
  }
})
const emit = defineEmits(['albumSelected'])

function handleAlbumSelection(event) {
  emit('albumSelected', event.target.value)
}
</script>

<template>
    <div class="flex column gap10 marTop20">
        <!-- Label for the select element -->
        <label for="albumSelect">Select an album:</label>
        
        <select 
            @change="handleAlbumSelection"
            id="albumSelect"
            class="pointer"
        >
            <!-- Default option -->
            <option 
                value="all"
                class="pointer"
            >
                all
            </option>
            
            <!-- Dynamically render albums from props -->
            <option 
                v-for="(album, index) in albums"
                :key="index"
                :value="`album${index}`"
                class="pointer"
            >
                {{ album.title }}
            </option>
        </select>
    </div>
</template>

<style scoped>
select {
    font-size: 20px;
    color: var(--textColor-main);
    background-color: var(--backdropColor);
    padding: 8px 16px 13px 16px;
    border: 1px solid rgb(75, 75, 75);
    border-radius: 5px;

    /* Remove the default browser arrow in most browsers */
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;

    /* Custom dropdown arrow via SVG background */
    background-image: url("data:image/svg+xml;charset=US-ASCII,%3csvg%20xmlns%3d%22http%3a//www.w3.org/2000/svg%22%20viewBox%3d%220%200%204%205%22%3e%3cpath%20fill%3d%22%23797979%22%20d%3d%22M2.07%205L0%202.93l.71-.71L2.07%203.57l1.36-1.35.71.71L2.07%205z%22/%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 20px center; /* adjust arrow positioning as needed */
    background-size: 12px;
}
select::selection {
    cursor: pointer;
}
</style>