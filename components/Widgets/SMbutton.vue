<template>
    <card>
        <div slot="header">
            <h4 class="card-title">{{config.selectDevice.name}} - {{config.varFullName}}</h4>
        </div>

        <i class="fa " :class="[config.icon, getIconColorClass()]" style="font-size: 30px"></i>

        <!-- Button -->  
        <base-button  @click="sendValue()" simple :type="config.class" class="mb-3 pull-right" size="sm">
            <i class="tim-icons icon-double-right"></i>{{config.text}}
        </base-button>
        
    </card>
</template>


<script>
    export default {
        props: ['config'],
        data(){
            return {
                sending: false,
                
            }
        },
        mounted() {
            
        },
        methods: {
            sendValue(){
                this.sending = true;

                setTimeout(() => {
                    this.sending=false;
                    }, 1000);

                const toSend = {
                    topic: this.config.userId + "/" + this.config.selectDevice.dId + "/" + this.config.variable + "/actdata",
                    msg: {
                        value: this.config.message
                    }
                }

                console.log(toSend);
                this.$nuxt.$emit('mqtt-sender', toSend);

            },
            getIconColorClass() {
                if(!this.sending){
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