<script setup>
const props = defineProps({
  width: {
    type: Number,
    required: true
  },
  height: {
    type: Number,
    required: true
  },
  url: {
    type: String,
    required: true
  }
});

const canvasRef = ref(null);

function drawImageOnCanvas() {
  const canvas = canvasRef.value;
  const ctx = canvas.getContext('2d');
  const img = new Image();
  img.onload = () => {
    const aspectRatio = img.width / img.height;
    const canvasAspectRatio = props.width / props.height;
    let drawWidth, drawHeight, offsetX, offsetY;

    if (aspectRatio > canvasAspectRatio) {
      drawHeight = props.height;
      drawWidth = img.width * (props.height / img.height);
      offsetX = -(drawWidth - props.width) / 2;
      offsetY = 0;
    } else {
      drawWidth = props.width;
      drawHeight = img.height * (props.width / img.width);
      offsetX = 0;
      offsetY = -(drawHeight - props.height) / 2;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  };
  img.src = props.url;
}

async function createResizedImageFile() {
  const canvas = canvasRef.value;
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      const file = new File([blob], 'resized-image.png', { type: 'image/png' });
      resolve(file);
    }, 'image/png');
  });
}

watch(() => props.url, drawImageOnCanvas);
onMounted(drawImageOnCanvas);

defineExpose({ 
    createResizedImageFile 
})

</script>

<template>
  <canvas :width="width" :height="height" ref="canvasRef"></canvas>
</template>

<style scoped>
canvas {
    width: 100%;
    height: 100%;
    display: block;
    border-radius: 10px;
}
</style>