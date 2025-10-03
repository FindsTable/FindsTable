<template>
    <div class="banner">
        <p class="flex alignCenter gap5">
            <img 
                src="https://admin.findstable.net/assets/8c5f8dd7-70a7-4711-9dc8-dbe9c57cd2d8?key=badge-h150-q100-webp" alt=""
                class="badge"
            >
            <span class="tierName typeface-fraunces">
                Plus
            </span>
        </p>

        <p class="flex alignCenter gap5 marTop5">
            <img 
                src="https://admin.findstable.net/assets/46d4694a-e302-43c5-9390-08e91a6de4aa?key=badge-h150-q100-webp" alt=""
                class="badge"
            >
            
            <span class="tierName typeface-fraunces">
                Pro
            </span>
        </p>

        <p class="marTop10">
            Support the project by subscribing to Plus or Pro membership and also get access to the full experience !
        </p>

        <div class="centered marTop10">
            <NuxtLink class="button pointer theme-mainActionButton">
                Try it now
            </NuxtLink>
        </div>
    </div>
</template>

<style scoped>
.banner {
    font-size: 14px;
    background-image: url('/images/foggy-field-banner.jpg');
    background-position: center;
    padding: 10px;
    border-radius: 10px;
}
.badge {
    width: 20px;
}
.tierName {
    font-weight: 600;
}
.button {
    padding: 10px;
    border-radius: 5px;
    box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.594);
}
</style>