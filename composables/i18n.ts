export {
    use$t
}

function use$t(messagePath: string): string {
    return useNuxtApp().$i18n.t(messagePath) as string
}