<script setup>
const formElement = ref(null)
const description = ref(null)
const image1 = ref(null)

async function callApi() {
    const formData = new FormData()
    formData.append('title', title.value)
    formData.append('description', description.value)
    if (image1.value && image1.value.files.length > 0) {
        formData.append('image1', image1.value.files[0])
    }

    try {
        const res = await $fetch(
            'https://admin.findstable.net/files',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                body: formData
            }
        )

    } catch (error) {
        console.error('Error:', error)
    }
}
</script>

<template>
    <form ref="formElement">
        <input type="file" ref="image1" />
    </form>
    <div @click.prevent="callApi" class="centered">
        <button class="comp-button -filled">
            api call
        </button>
    </div>
</template>
