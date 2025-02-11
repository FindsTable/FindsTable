<script setup>
const user = useUserState()

const currentAvatar = computed(() => {
    // lasyUserContent fetches the avatars, index 0 is the current one
    if(useUserContent().value.avatars.length) {
        return useUserContent().value.avatars[0].image
    }
})

</script>

<template>
    <div class="box ">
        <NuxtLink to="/account" id="sidebarAccountCard" class="
                -bgColor
                card block pointer relative">
            <ArchitectureTexturePaper file="/textures/paper-150x100.jpg">
                <div class="content centered">
                    <ArchitectureFramesAvatar :fileId="useUserState().value.avatar" round width="50px" />

                    <p class="centered font-text -big">
                        {{ user.username }}
                    </p>
                </div>
            </ArchitectureTexturePaper>
        </NuxtLink>
    </div>
</template>

<style scoped>

.card {
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 1px 2px 3px rgb(36, 36, 36);
    transition: 100ms ease;
}
.card:hover {
    filter: brightness(0.9);
    box-shadow: 1px 2px 5px rgb(36, 36, 36);
}
.content {
    padding: 10px 20px;
}
.frame {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    overflow: hidden;
}
</style>