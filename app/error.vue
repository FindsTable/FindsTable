<script setup>
function navigateToHome() {
    navigateTo('/')
}
</script>

<template>
    <NuxtLayout
        name="public"
    >
        <div
            class="comp-panel theme-surface-1 pad20 marTop100 marBot100 centered"
        >
            <div
                class="flex column alignCenter gap20 w100"
            >
                <tH1
                    class="theme-titleColor-main textAlignCenter"
                >
                    Oops! Something Went Wrong
                </tH1>
                <p
                    class="font-pageLead theme-textColor-main textAlignCenter"
                >
                    We couldn't find the page you were looking for or an error occurred.
                </p>
                <button
                    class="comp-button -filled font-button-main"
                    @click="navigateToHome"
                >
                    Back to Home
                </button>
            </div>
        </div>
    </NuxtLayout>
</template>

<style scoped>
/* Using utility classes for styling, no custom CSS needed */
</style>