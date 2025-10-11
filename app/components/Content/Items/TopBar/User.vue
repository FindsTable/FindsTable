<script setup>

const props = defineProps({
    userId: String,
    date: String,
    size: {
        type: String,
        default: 'default'
    },
    isLink: {
        type: Boolean,
        default: true
    },
    hideBorderBottom: {
        type: Boolean,
        default: false
    },
    hideBadgeRecord: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['delete'])

const { data: user } = cacheDbGet(
    `user:idCard:${props.userId}`,
    `/users/${props.userId}`,
    {
        fields: [
            'id,avatar,username,displayName',
            'badgeRecord.slot1,badgeRecord.slot2,badgeRecord.slot2'
        ]
    }
)

</script>

<template v-if="user?.id">
    <div 
        class="w100 container flex justifyBetween"
        :class="[
            `size_${size}`,
            hideBorderBottom ? '' : 'borderBottom'
        ]"
    >
        <div
            v-if="user?.id"
            class="userLink h100 grow flex alignStart gap10"
        >
            <NuxtLink 
                :to="`/users/${user.id}`" 
                class="username pointer"
            >
                <HtmlImageAssetId 
                    :id="user?.avatar"
                    class="avatar block round"
                />
            </NuxtLink>

            <div 
                :to="`/users/${user.id}`" 
                class="grow textBox h100 relative"
            >
                <div class="absoluteFull flex column">
                    <NuxtLink 
                        :to="`/users/${user.id}`" 
                        class="w100 username pointer"
                    >
                        {{ user.displayName }}
                    </NuxtLink>

                    <span 
                        v-if="date"
                        class="date"
                    >
                        {{ date }}
                    </span>
                </div>
            </div>
        </div>

        <ContentBadgesBadgeRecordPublic
            v-if="user?.id && !hideBadgeRecord"
            :userId="user.id"
            class="badgeRecord"
        />
    </div>
</template>

<style scoped>
.container.borderBottom {
    border-bottom: 1px solid rgba(255, 255, 255, 0.29);
    padding-bottom: 10px;
}
.container.size_default .userLink {
    height: 30px;
}
.container.size_default .avatar {
    height: 100%;
    aspect-ratio: 1;
    width: 30px;
}
.container.size_default .badgeRecord {
    height: 30px;
}
.size_default .username {
    font-size: 14px;
}
.size_default .date {
    font-size: 10px;
    font-weight: 100;
}

.username, .date {
    overflow: hidden;
    text-overflow: ellipsis;
    text-wrap: nowrap;
}
.round {
    border-radius: 1000px;
    overflow: hidden;
}


</style>

