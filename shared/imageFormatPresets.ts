import {
    allowedMimeTypes
} from '#shared/config'

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
        allowUpscale: true,
        filenameSuffix: 'finds-table_booty-photo',
    },
    find: {
        shortSidePx: 1080,
        longSidePx: 1080,
        orientation: 'auto',
        fit: 'cover',
        position: 'center',
        mimeType: 'image/webp',
        quality: 0.85,
        sizeBudgetKB: 350,
        allowUpscale: true,
        filenameSuffix: 'finds-table_find',
    }
}

type ImageFormatPresetKey = 'bootyPhoto' | 'find'

type ImageFormatPresets = {
    [key in ImageFormatPresetKey]: ImageFormatPreset
}

type MimeType = 'image/webp'

interface ImageFormatPreset {
    shortSidePx: number
    longSidePx: number
    orientation: 'auto' | 'portrait' | 'landscape'
    fit: 'cover' | 'contain'
    position: 'center' | 'top' | 'bottom' | 'left' | 'right'
    mimeType: string
    quality: number
    sizeBudgetKB?: number
    allowUpscale: boolean
    filenameSuffix: string
}


