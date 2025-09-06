import success from '@/locales/en/messages/success.json'

export {
    useToaster,
    useToasters,
    useWelcomeBackString,
}

export type { 
    ToasterData 
}

const useToasters = () => {
    return useState<{
        [key: string]: Toaster
    }>('toasters',
        () => ({
        /*
        initialized as empty object.  It will hold 
        all toasters only if they are requested
        */
        })
    );
}

const useToaster = (action: 'show' | 'hide', toaster: ToasterData) => {
    const toasters = useToasters()

    const id = toaster.id

    if (action === 'hide') {
        if (toasters.value[id]) {
            toasters.value[id].showing = false
            delete toasters.value[id]
        }
    } else if (action === 'show') {
        toasters.value[id] = {
            ...toaster,
            showing: false,
            timer: undefined
        }

        if (toaster.autoClose) {
            toasters.value[id].timer = setTimeout(() => {
                if(toasters.value[id]) {
                    toasters.value[id].showing = false
                    delete toasters.value[id]
                }
            }, 4000)
        }
    }
}

function useWelcomeBackString(t: any) {
    const user = useUserState()
    const index = getRandomNumber(1, Object.keys(success.success.auth.welcomeBack).length)

    let helloUser = ''
    let welcomeBack = t(`success.auth.welcomeBack.${index}`)

    if(user.value.username) {
        helloUser = `${t('success.auth.helloUser')}${user.value.username} `
    }

    return helloUser + welcomeBack
} 

function getRandomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


interface Toaster extends ToasterData {
    showing: boolean
    timer: NodeJS.Timeout | undefined
}

type Timeout = number

interface ToasterData {
    id: string
    messagePath?: string
    message?: string
    icon?: string | 'error' | 'warning' | 'info' | 'success'
    type: string
    autoClose: boolean,
    position: 'bottom' | 'top'
}