<template>
    <card>
        <div slot="header">
            <h4 class="card title">{{config.selectDevice.name}} - {{config.varFullName}}</h4>
        </div>

        <i class="fa " :class="[config.icon, getIconColorClass()]" style="font-size: 30px"></i>


    </card>
</template>

<script>
    export default {
        //props: ['config'],
        data(){
            return {
                value: true,
                config: {
                    userId: 'userId',
                    selectDevice: {
                        name: "Paciente 1",
                        dId: "8888",
                        templateName: "Temp Sensor",
                        templateId: "24244242424",
                        saverRule: false
                    },
                    varFullName: "Temp",
                    variable: "uniquestr",
                    icon: 'fa-sun',
                    column: 'col-6',
                    widget: 'indicator',
                    class: 'danger'
                }
            }
        },
        mounted() {
            this.$nuxt.$on('widget-topic', this.processReceivedData)
        },
        methods: {
            processReceivedData(data) {
                console.log("received");
                console.log(data);
                this.value = data.value;
            },
            getIconColorClass() {
                if(!this.value){
                    return "text-dark"
                }
                if(this.config.class == "success"){
                    return "text-success"
                }
                if(this.config.class == "primary"){
                    return "text-primary"
                }
                if(this.config.class == "warning"){
                    return "text-warning"
                }
                if(this.config.class == "danger"){
                    return "text-danger"
                }
            }
        }
    }
</script>