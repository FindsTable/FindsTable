<script setup>
const { t } = useI18n();
const me = useUserState()

const body = {
  "collection": "Finds_likes",
  "meta": {
    "collection": "Finds_likes",
    "group": "Finds",
    "collapse": "open",
    "sort": 4
  },
  "schema": {
    "name": "Finds_likes",
    "fields": [
      {
        "field": "id",
        "type": "uuid",
        "schema": {
          "is_primary_key": true
        },
        "meta": {
          "interface": "input"
        }
      },
      {
        "field": "user_created",
        "type": "uuid",
        "schema": {
          "is_nullable": false
        },
        "meta": {
          "interface": "select-dropdown-m2o"
        }
      },
      {
        "field": "date_created",
        "type": "timestamp",
        "schema": {
          "is_nullable": false
        },
        "meta": {
          "interface": "datetime"
        }
      },
      {
        "field": "uniqueKey",
        "type": "string",
        "schema": {
          "is_nullable": false
        },
        "meta": {
          "interface": "input"
        }
      },
      {
        "field": "find",
        "type": "uuid",
        "schema": {
          "is_nullable": false,
          "has_index": true
        },
        "meta": {
          "interface": "select-dropdown-m2o"
        }
      }
    ]
  }
}

const collection = ref(null)

async function handleClick(method) {
    let res = null

    if(method === 'get') {
        const allFields = await $fetch('https://admin.findstable.net/fields', {
            method: 'GET',
            headers: {
                authorization: `Bearer AvRb8UT7PSIVzYa9FF1v88z0ZdRT2YcK`
            }
            })

            const fields = allFields.data.filter(f => f.collection === 'Finds_likes')
            console.log('Fields in Finds_likes:', fields.map(f => f.field))

            res = fields
    } else {
        try {
            res = res = await $fetch(
                'https://admin.findstable.net/collections', 
                {
                    method: 'POST',
                    headers: {
                        authorization: `Bearer AvRb8UT7PSIVzYa9FF1v88z0ZdRT2YcK`
                    },
                    body: body
                }
            )
        } catch(e) {
            console.log(e)
        }
    }
        
        if(res?.data) {
            console.log(res)
            collection.value = res.data
        }
        
}

definePageMeta({
    title: 'Legal notice',
    middleware: 'public-route',
})

</script>

<template>
    <NuxtLayout 
        name="private-route"
        v-if="me.isLoggedIn"
    >
        <template #title>
            <button 
                @click.prevent="handleClick('post')"
                class="comp-button -filled"
            >
                POST
            </button>
            <button 
                @click.prevent="handleClick('get')"
                class="comp-button -filled"
            >
                GET
            </button>
        </template>

        <template #header>

        </template>

        <template #noScrollMain>

        </template>

        <template #scrollMain>
            <p v-if="collection">
                {{ collection }} }}
            </p>
            <PagesLegalNotice />
        </template>
    </NuxtLayout>

    <NuxtLayout 
        name="public-route"
        v-else
    >
        <main>
            <PagesLegalNotice />
        </main>
    </NuxtLayout>
</template>