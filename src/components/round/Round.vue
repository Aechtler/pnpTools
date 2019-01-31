<template>
    <div class="jumbotron jumbotron-fluid">
        <div class="container">
            <h1 class="display-4"><font-awesome-icon icon="flag" /> Round: {{roundCount}}</h1>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            roundCount: {
                type: Number,
                required: true
            },
        }
    }
</script>