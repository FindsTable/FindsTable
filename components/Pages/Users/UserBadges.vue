<script setup lang="ts">
const userContent = useUserContent()

const props = defineProps({
    userId: {
        type: String,
        required: true
    }
})
const $items = useNuxtApp().$items


const { data : badges, refresh } = await useAsyncData<UserBadgeObject[] | null>(
    `badges-${props.userId}`,
    async (): Promise<UserBadgeObject[] | null> => {
        if( 
            props.userId === useUserState().value.id &&
            userContent.value.badges
        ) {
            console.log("no need for fetching badges")
            return userContent.value.badges
        }

        const res = await $items.getByQuery<UserBadgeObject>({
            collection: 'User_badges',
            query:{
                fields: 'userId,badgeId.id,badgeId.file,badgeId.key,badgeId.isDynamic',
                filter: {
                    userId: {
                        _eq: props.userId
                    }
                }
            }
        })
        console.log("badges", res.data)
        return res.data
    }
)

</script>

<template>
    <div 
        v-if="badges"
        class="flex gap30"
    >
        <div 
            v-for="badge in badges" :key="badge.id"
        >
            <ArchitectureFramesUserBadgeMain
                :active="true"
                :badge="{
                    userId: badge.userId as string,
                    id: badge.badgeId.id,
                    key: badge.badgeId.key,
                    file: badge.badgeId.file,
                    isDynamic: badge.badgeId.isDynamic,
                }"
            />
        </div>
    </div>
</template>

<style scoped>

img {
    height: 150px;
}
</style>