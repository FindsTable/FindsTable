<script setup>
const fields = [
  'id',
  'username',
  'displayName',
  'avatar',
  'currentAvatar.*',
  'badgeRecord.*',
  'badgeRecord.slot1.*',
  'badgeRecord.slot2.*',
  'badgeRecord.slot3.*',
  'patreon_account.tier.*',
  'patreon_account.tier.translations.*',
  'personalDataRecord.*',
  'personalDataRecord.email.*',
  'personalDataRecord.firstName.*',
  'personalDataRecord.lastName.*'
];

const {
    response : users,
    error,
    isPending
} = useDirectAsyncFetch(
    'GET', '/users',
    {
        query: {
            fields: fields.join(','),
            filter: {
                id: {
                    _neq: useUserState().value.id
                }
            },
            deep: {
                avatars: {
                    _sort: "-currentAt",
                    _limit: 1
                }
            }
        }
    }
)

definePageMeta({
    title: 'Users',
    description: 'Search for users in our community.',
    middleware: 'private-route',
});
</script>

<template>
    <NuxtLayout name="private-route">
        <template #title>
            Users
        </template>
        
        <template #header>
            Check the detectorists
        </template>

        <template #scrollMain>
            <div 
                v-if="users" 
                class="flex column gap10"
            >
                <PagesUsersCard 
                    v-for="user in users" :key="user.id" 
                    :user="user"
                />
            </div>
        </template>
    </NuxtLayout>
</template>