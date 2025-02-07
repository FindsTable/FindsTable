<script setup>
import { ArchitectureOverlayModalsConfirmCancel as ConfirmCancel } from '#components';
const user = useUserState()
const props = defineProps({
    maxWidth: {
        type: Number,
        default: 150
    },
    maxHeight: {
        type: Number,
        default: 150
    },
    outputFormat: {
        type: String,
        default: 'image/jpeg'
    },
    outputQuality: {
        type: Number,
        default: 0.7
    }
});

const modalState = useModalState();
const { confirm, cancel } = useModal();
const imageElement = ref(null);
const canvasElement = ref(null);
const ctx = ref(null);

const cropping = reactive({
    offsetX: 0,
    offsetY: 0,
    scale: 1,
    isDragging: false,
    startX: 0,
    startY: 0
});

const zoomFactorFromSlider = ref(50); // Reactive property for zoom factor

onMounted(() => {
    const img = imageElement.value;
    const canvas = canvasElement.value;
    ctx.value = canvas.getContext('2d');

    img.onload = () => {
        drawImage();
    };
});

const drawImage = () => {
    const img = imageElement.value;
    const canvas = canvasElement.value;
    ctx.value.clearRect(0, 0, canvas.width, canvas.height);
    ctx.value.drawImage(
        img,
        cropping.offsetX,
        cropping.offsetY,
        img.width * cropping.scale,
        img.height * cropping.scale
    );
    drawCropFrame();
};

const drawCropFrame = () => {
    ctx.value.strokeStyle = 'red';
    ctx.value.strokeRect(
        (canvasElement.value.width - props.maxWidth) / 2,
        (canvasElement.value.height - props.maxHeight) / 2,
        props.maxWidth,
        props.maxHeight
    );
};

const startDrag = (event) => {
    cropping.isDragging = true;
    cropping.startX = event.clientX;
    cropping.startY = event.clientY;
};

const doDrag = (event) => {
    if (!cropping.isDragging) return;
    const dx = event.clientX - cropping.startX;
    const dy = event.clientY - cropping.startY;
    cropping.offsetX += dx;
    cropping.offsetY += dy;
    cropping.startX = event.clientX;
    cropping.startY = event.clientY;
    drawImage();
};

const endDrag = () => {
    cropping.isDragging = false;
};

const zoomWithWheel = (event) => {
    event.preventDefault();
    const scaleAmount = event.deltaY * zoomFactorFromSlider.value / -100000;
    cropping.scale += scaleAmount;
    cropping.scale = Math.min(Math.max(0.1, cropping.scale), 5); // Limit zoom levels
    drawImage();
};
const zoomWithButtons = (direction) => {
    const scaleAmount = direction * zoomFactorFromSlider.value / 1000;
    cropping.scale += scaleAmount;
    cropping.scale = Math.min(Math.max(0.1, cropping.scale), 5); // Limit zoom levels
    drawImage();
};

const handleConfirm = () => {
    const cropX = (canvasElement.value.width - props.maxWidth) / 2 - cropping.offsetX;
    const cropY = (canvasElement.value.height - props.maxHeight) / 2 - cropping.offsetY;
    const croppedCanvas = document.createElement('canvas');
    const croppedCtx = croppedCanvas.getContext('2d');

    croppedCanvas.width = props.maxWidth;
    croppedCanvas.height = props.maxHeight;

    croppedCtx.drawImage(
        imageElement.value,
        cropX / cropping.scale,
        cropY / cropping.scale,
        props.maxWidth / cropping.scale,
        props.maxHeight / cropping.scale,
        0,
        0,
        props.maxWidth,
        props.maxHeight
    );

    // croppedCanvas.toBlob((blob) => {
    //     confirm(blob);
    // }, 'image/jpeg', 0.7);

    croppedCanvas.toBlob((blob) => {
        if (blob) {
            // Convert Blob to File
            const file = new File([blob], `av-${user.value.username}-${Date.now()}.jpg`, { type: 'image/jpeg' });

            // Use the File object
            confirm(file); // Return or process the File
        }
    }, 'image/jpeg', 0.7);
};
</script>

<template>
    <div id="cropper" class="w100 centered">
        <div class="centered">
            <img ref="imageElement" :src="modalState.data" alt="" class="objectFitContain" style="display: none;" />
            <canvas ref="canvasElement" width="300px" height="300px" @mousedown="startDrag" @mousemove="doDrag" @mouseup="endDrag" @wheel="zoomWithWheel"></canvas>
        </div>

        <div class="flex justifyCenter alignCenter gap30 marTop20">
            <button class="comp-button -filled" @click.prevent="zoomWithButtons(1)">
                <Icon name="zoomIn" />
            </button>

            <button class="comp-button -filled" @click.prevent="zoomWithButtons(-1)">
                <Icon name="zoomOut" />
            </button>
        </div>

        <div class="flex justifyCenter alignCenter gap20 marTop20">
            <label class="font-text -small" for="zoomSlider">zoom speed:</label>
            <input id="zoomSlider" type="range" min="1" max="100" step="1" v-model="zoomFactorFromSlider">
        </div>

        <ConfirmCancel @confirm="handleConfirm" @cancel="cancel()" />
    </div>
</template>

<style scoped>
canvas {
    width: min(100%, 200px);
    aspect-ratio: 1 / 1;
    border: 1px solid #ccc;
    overflow: visible;
}
</style>

