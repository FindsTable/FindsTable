export {
    useHandleError
}

function useHandleError(error : any) {
    if(!error) return
    
    if(error.data?.data?.toasterPath) {
        const err = error.data.data;

        if(err.toasterPath) {
            useToaster('show', {
                id: `${Math.random()}`,
                message: use$t(err.toasterPath),
                type: 'error',
                autoClose: true,
                position: 'bottom'
            })
        }
    }
    
    handleDebugErrorLogs(error)
}

function handleDebugErrorLogs(error : any) {
    if(!useAppConfig().showErrorLogs) return

    if(error.data?.data) {
        const err = error.data.data;
        console.error("Reason:", err.reason);
        return
    }
    if(error.message) {
        console.error("Message:", error.message);
        return
    }
    if(error.statusMessage) {
        console.error("StatusMessage:", error.statusMessage);
        return
    }  
}