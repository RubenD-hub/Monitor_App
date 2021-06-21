<template>
    <div class="row">
        
        <div class="col-4">
            <Indicator :config="config1"></Indicator>
        </div>
        <div class="col-4">
            <Indicator :config="config2"></Indicator>
        </div>
        <div class="col-4">
            <Indicator :config="config3"></Indicator>
        </div>

        <button @click="sendData()">SEND</button>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                value: false,

                config1: {
                    userId: 'userId',
                    selectDevice: {
                        name: "Paciente 1",
                        dId: "8888",
                        templateName: "Temp Sensor",
                        templateId: "24244242424",
                        saverRule: false
                    },
                    varFullName: "Temp",
                    variable: "var1",
                    icon: 'fa-sun',
                    column: 'col-6',
                    widget: 'indicator',
                    class: 'danger'
                },
                config2: {
                    userId: 'userId',
                    selectDevice: {
                        name: "Paciente 1",
                        dId: "8888",
                        templateName: "Temp Sensor",
                        templateId: "24244242424",
                        saverRule: false
                    },
                    varFullName: "SaO2",
                    variable: "var2",
                    icon: 'fa-sun',
                    column: 'col-6',
                    widget: 'indicator',
                    class: 'danger'
                },
                config3: {
                    userId: 'userId',
                    selectDevice: {
                        name: "Paciente 1",
                        dId: "8888",
                        templateName: "Temp Sensor",
                        templateId: "24244242424",
                        saverRule: false
                    },
                    varFullName: "FR",
                    variable: "var3",
                    icon: 'fa-sun',
                    column: 'col-6',
                    widget: 'indicator',
                    class: 'danger'
                }
            }
        },
        methods: {
            sendData(){
                this.value = !this.value;
                const toSend = {
                    value: this.value
                }
                this.$nuxt.$emit('widget-topic', toSend );
            }
        }
    }
</script>