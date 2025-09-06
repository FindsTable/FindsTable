/*
    wait for any value to become the expectedValue
    timeout in case of problem that prompts the user to keep waiting or not
*/

export {
    useWaitFor
} 

function useWaitFor<T>(
  target: any,
  expectedValue: any,
  timeoutDuration?: number
): Promise<void> {
  return new Promise<void>((resolve, reject) => {

    const matches = (v: T) =>
      typeof expectedValue === 'function'
        ? (expectedValue as (x: T) => boolean)(v)
        : Object.is(v, expectedValue)

    const { openModal } = useConfirmationModal()

    let stopped = false
    let timeoutId: ReturnType<typeof setTimeout> | null = null

    const clearTimer = () => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId)
        timeoutId = null
      }
    }

    const startTimer = () => {
      clearTimer()
      if (timeoutDuration == null) return
      
      timeoutId = setTimeout(async () => {
        // Timeout reached → ask the user whether to continue waiting
        try {
          await openModal({
            title: 'Keep waiting?',
            message: "It's taking longer than expected. Do you want to keep waiting?",
          })
          // User confirmed → restart timer and continue waiting
          if (!stopped) startTimer()
        } catch {
          // User cancelled → stop everything and reject
          stop()
          reject(new Error('useWaitFor: cancelled by user'))
        }
      }, timeoutDuration)
    }

    const stop = () => {
      if (stopped) return
      stopped = true
      clearTimer()
      unwatch()
    }

    // Watch the target value
    let initialMatched = false
    const unwatch = watch(
      target,
      (v) => {
        if (matches(v)) {
          initialMatched = true
          stop()
          resolve()
        }
      },
      { immediate: true }
    )

    // If not already matched immediately, start the timer cycle
    if (!initialMatched) startTimer()

    onScopeDispose(() => {
      stop()
    })
  })
}