export {
    useHandleError
}

function useHandleError(error : any) {
    handleDebugErrorLogs(error)
    if(error.data?.data?.toasterPath) {
        console.log("⚠️ TO DO : Show toaster fro error message")
    }
}

function handleDebugErrorLogs(error : any) {
    if(!useAppConfig().showErrorLogs) return

    console.error("Error message:", error.message);
    console.error("Status code:", error.statusCode);
}