export const useModalState = () => {
    return useState<{
        visible: boolean
        modal?: string
        component?: string
        data?: any
        content?: {
            title: string
            message: string
        }
        resolveFn: any
        rejectFn: any
    }>(
        'modalState',
        () => ({
            visible: false,
            modal: '',
            component: '',
            data: undefined,
            content: {
                title: '',
                message: ''
            },
            resolveFn: undefined,
            rejectFn: undefined
        })
    );
}

export function useModal() {
    const modalState = useModalState()

    const openModal = (p: {
        modal?: string
        component?: any
        data?: any
        content?: {
            title: string
            message: string
        }
    }) => {
        if(modalState.value.visible) {
            return
        }
        modalState.value.modal = p.modal
        modalState.value.component = p.component
        if(p.content) {
        modalState.value.content = p.content
        }
        if (p.data) {
            modalState.value.data = p.data
        }

        modalState.value.visible = true

        return new Promise((resolve, reject) => {
            modalState.value.resolveFn = resolve
            modalState.value.rejectFn = reject
        })
    }

    const confirm = (data: any = true) => {
        modalState.value.visible = false
        modalState.value.resolveFn(data)
    }

    const cancel = (reason: any = false) => {
        modalState.value.visible = false
        modalState.value.rejectFn(false)
    }

    return {
        openModal,
        confirm,
        cancel
    }
}