<template>
    <p 
        class="
            w100 marTop20
            flex gap10
            font-text --main -semibold
        "
    >
        <Icon name="info" size="42px" />
        
        <slot>

        </slot>
    </p>
</template>

<style scoped>
p {
    background: var(--color-info-bg);
    padding: 10px;
    border: 1px solid var(--color-info-border);
    border-radius: 10px;
}
</style>