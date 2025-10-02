<template>
    <div class="flex">
        <NuxtLink
            to="/hunt-reports/new"
            class="banner pointer block"
        >
            <TH3>
                Create a new hunt report
            </TH3>

            <p class="marTop10">
                Share your journey and build you log book of you excursions.
            </p>

            <div class="centered marTop20">
                <button 
                    @click.stop
                    class=" comp-button -filled"
                >
                    new
                </button>
            </div>
        </NuxtLink>
    </div>
    
</template>

<style scoped>
.banner {
    width: 100%;
    background-image: url('/images/chemin-creux.jpg');
    background-position: center;
    padding: 15px;
    border-radius: 8px;
    overflow: hidden;
}
</style>