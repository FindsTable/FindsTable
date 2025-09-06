export {
    imageFormatPresets
}

export type {
    ImageFormatPreset,
    ImageFormatPresetKey
}

const imageFormatPresets : ImageFormatPresets = {
    bootyPhoto: {
        shortSidePx: 1024,
        longSidePx: 1820,
        orientation: 'auto',
        fit: 'cover',
        position: 'center',
        mimeType: 'image/webp',
        quality: 0.85,
        sizeBudgetKB: 350,
        allowUpscale: false,
        filenameSuffix: '_webp_1024min_flex',
    }
}

type ImageFormatPresetKey = 'bootyPhoto'

type ImageFormatPresets = {
    [key in ImageFormatPresetKey]: ImageFormatPreset
}

interface ImageFormatPreset {
    shortSidePx: number
    longSidePx: number
    orientation: 'auto' | 'landscape' | 'portrait'
    fit: 'cover' | 'contain'
    position: 'center' | 'top' | 'bottom' | 'left' | 'right'
    mimeType: 'image/webp' | 'image/jpeg'
    quality: number
    sizeBudgetKB: number
    allowUpscale: boolean
    filenameSuffix: string
}


