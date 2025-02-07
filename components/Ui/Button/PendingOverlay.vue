<template>
    <div class="pendingOverLay absoluteFull">
        <div class="ball"></div>
    </div>
</template>

<style scoped>
.pendingOverLay {
    background-color: rgb(102, 102, 102);
    display: none;
}
.ball {
    background-color: white;
    height: 5px;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    translate: -50% -50%;
    animation-name: pendingBall;
    animation-duration: 1s;
    animation-iteration-count: infinite;
    animation-direction: alternate;
    animation-timing-function: ease-in-out;
}

@keyframes pendingBall {
    0% {
        transform: translateX(-20px);
        width: 5px;
    }
    100% {
        transform: translateX(20px);
        width: 5px;
    }
}
</style>

<style>
button.pending .pendingOverLay {
    display: block;
}
</style>