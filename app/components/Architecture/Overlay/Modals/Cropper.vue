<script setup>
import { ArchitectureOverlayModalsConfirmCancel as ConfirmCancel } from '#components'

const user = useUserState()

const props = defineProps({
  outputFormat: {
    type: String,
    default: 'image/jpeg'
  },
  outputQuality: {
    type: Number,
    default: 0.7
  }
})

const modalState = useModalState()
const { confirm, cancel } = useModal()

const imageElement = ref(null)
const canvasElement = ref(null)
const ctx = ref(null)

const croppingSize = computed(() => {
  return modalState.value.options?.croppingSize ?? {
    width: 150,
    height: 150
  }
})

const canvasSize = computed(() => {
  const paddingFactor = 2
  return {
    width: croppingSize.value.width * paddingFactor,
    height: croppingSize.value.height * paddingFactor
  }
})

const cropping = reactive({
  offsetX: 0,
  offsetY: 0,
  scale: 1,
  isDragging: false,
  startX: 0,
  startY: 0
})

const zoomFactorFromSlider = ref(50)

onMounted(() => {
  const img = imageElement.value
  const canvas = canvasElement.value
  ctx.value = canvas.getContext('2d')

  img.onload = () => {
    nextTick(() => {
      cropping.scale = 1
      cropping.offsetX = (canvasSize.value.width - img.width) / 2
      cropping.offsetY = (canvasSize.value.height - img.height) / 2
      drawImage()
    })
  }

  if (img.complete && img.naturalWidth > 0) {
    img.onload()
  }
})

const drawImage = () => {
  const img = imageElement.value
  const canvas = canvasElement.value

  if (!ctx.value || !img) return

  ctx.value.clearRect(0, 0, canvas.width, canvas.height)

  ctx.value.drawImage(
    img,
    cropping.offsetX,
    cropping.offsetY,
    img.width * cropping.scale,
    img.height * cropping.scale
  )

  drawCropFrame()
}

const drawCropFrame = () => {
  const canvas = canvasElement.value
  if (!ctx.value) return

  ctx.value.strokeStyle = 'red'
  ctx.value.lineWidth = 2
  ctx.value.strokeRect(
    (canvas.width - croppingSize.value.width) / 2,
    (canvas.height - croppingSize.value.height) / 2,
    croppingSize.value.width,
    croppingSize.value.height
  )
}

const startDrag = (event) => {
  cropping.isDragging = true
  cropping.startX = event.clientX
  cropping.startY = event.clientY
}

const doDrag = (event) => {
  if (!cropping.isDragging) return

  const canvas = canvasElement.value
  const rect = canvas.getBoundingClientRect()

  // Find how much bigger the canvas coordinate space is than its on-screen size
  const scaleX = canvas.width / rect.width
  const scaleY = canvas.height / rect.height

  const dx = (event.clientX - cropping.startX) * scaleX
  const dy = (event.clientY - cropping.startY) * scaleY

  cropping.offsetX += dx
  cropping.offsetY += dy

  cropping.startX = event.clientX
  cropping.startY = event.clientY

  drawImage()
}
const endDrag = () => {
  cropping.isDragging = false
}

const zoomWithWheel = (event) => {
  event.preventDefault()
  const scaleAmount = event.deltaY * zoomFactorFromSlider.value / -100000
  cropping.scale += scaleAmount
  cropping.scale = Math.min(Math.max(0.1, cropping.scale), 5)
  drawImage()
}

const zoomWithButtons = (direction) => {
  const scaleAmount = direction * zoomFactorFromSlider.value / 1000
  cropping.scale += scaleAmount
  cropping.scale = Math.min(Math.max(0.1, cropping.scale), 5)
  drawImage()
}

const handleConfirm = () => {
  const img = imageElement.value
  const canvas = canvasElement.value

  const cropWidth = croppingSize.value.width
  const cropHeight = croppingSize.value.height

  const cropFrameX = (canvas.width - cropWidth) / 2
  const cropFrameY = (canvas.height - cropHeight) / 2

  const sourceX = (cropFrameX - cropping.offsetX) / cropping.scale
  const sourceY = (cropFrameY - cropping.offsetY) / cropping.scale
  const sourceW = cropWidth / cropping.scale
  const sourceH = cropHeight / cropping.scale

  const croppedCanvas = document.createElement('canvas')
  const croppedCtx = croppedCanvas.getContext('2d')

  croppedCanvas.width = cropWidth
  croppedCanvas.height = cropHeight

  croppedCtx.drawImage(
    img,
    sourceX, sourceY, sourceW, sourceH,
    0, 0, cropWidth, cropHeight
  )

  croppedCanvas.toBlob((blob) => {
    if (blob) {
      const file = new File(
        [blob],
        `av-${user.value.username}-${Date.now()}.jpg`,
        { type: 'image/jpeg' }
      )
      confirm(file)
    }
  }, props.outputFormat, props.outputQuality)
}
</script>

<template>
  <div id="cropper" class="w100 centered">
    <div class="centered">
      <img 
        ref="imageElement" 
        :src="modalState.data"
        alt="" 
        class="objectFitContain" 
        style="display: none;"
      />
      <canvas 
        ref="canvasElement" 
        :width="canvasSize.width"
        :height="canvasSize.height"
        @mousedown="startDrag" 
        @mousemove="doDrag" 
        @mouseup="endDrag" 
        @wheel="zoomWithWheel"
      />
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
      <input 
        id="zoomSlider" 
        type="range" 
        min="1" 
        max="100" 
        step="1" 
        v-model="zoomFactorFromSlider"
      >
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