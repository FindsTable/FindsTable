export const useConfirmationModalState = () => {
    return useState<{
        isVisible: boolean
        title: any
        message: any
        resolveFn: any
        rejectFn: any
    }>(
        'confirmationModalState',
        () => ({
            isVisible: false,
            title: '',
            message: '',
            resolveFn: undefined,
            rejectFn: undefined
        })
    );
}

export function useConfirmationModal() {
    const modalState = useConfirmationModalState()
    
    const openModal = (p: {
        title: string,
        message: string
    }) => {
        modalState.value.title = p.title
        modalState.value.message = p.message
        modalState.value.isVisible = true

        return new Promise((resolve, reject) => {
            modalState.value.resolveFn = resolve
            modalState.value.rejectFn = reject
        })
    }

    const confirm = () => {
        modalState.value.isVisible = false
        modalState.value.resolveFn(true)
    }

    const cancel = () => {
        modalState.value.isVisible = false
        modalState.value.rejectFn(false)
    }

    return {
        openModal,
        confirm,
        cancel,
    }
}