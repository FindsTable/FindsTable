export {
    assertUsernameIsUnique,
    usernameValidation
}

async function assertUsernameIsUnique(name: string): Promise<void> {
    await $fetch('/api/auth/username-is-unique', {
        method: 'POST',
        body: {
            username: name
        }
    });
}

function usernameValidation() : {
    usernameIsPending: Ref<boolean>
    usernameTimeout: Ref<ReturnType<typeof setTimeout> | null>
    usernameIsUnique: Ref<boolean>
    validateUsername: (name: string) => Promise<boolean>
} {
    const usernameIsPending = ref<boolean>(false);
    const usernameTimeout = ref<ReturnType<typeof setTimeout> | null>(null);
    const usernameIsUnique = ref<boolean>(false);

    async function validateUsername(name: string): Promise<boolean> {
        
        if (usernameIsPending.value) return false;
        usernameIsPending.value = true;

        if (name.length > 50 || name.length < 1) {
            usernameIsPending.value = false;
            return false;
        }

        if (usernameTimeout.value) clearTimeout(usernameTimeout.value);

        return new Promise((resolve) => {
            usernameTimeout.value = setTimeout(async () => {
                console.log('will validate my username')
                try {
                    await $fetch('/api/auth/username-is-unique', {
                        method: 'POST',
                        body: { 
                            username: name 
                        }
                    });
                    usernameIsUnique.value = true;
                    resolve(true);
                } catch {
                    usernameIsUnique.value = false;
                    resolve(false);
                } finally {
                    usernameIsPending.value = false;
                    usernameTimeout.value = null;
                }
            }, 1000);
        });
    }

    return {
        usernameIsPending,
        usernameTimeout,
        usernameIsUnique,
        validateUsername
    };
}