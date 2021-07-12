<template>
  <div class="row" v-if="$store.state.devices.length > 0">

    <div
      v-for="(widget, index) in $store.state.selectedDevice.template.widgets"
      :key="index"
      :class="[widget.column]"
      
    >
    
    <Json :value="fixWidget(widget)"></Json>

      <Rtnumberchart
        v-if="widget.widget == 'numberchart'"
        :config="fixWidget(widget)"
      ></Rtnumberchart>

      <SMswitch
        v-if="widget.widget == 'switch'"
        :config="fixWidget(widget)"
      ></SMswitch>

      <SMbutton
        v-if="widget.widget == 'button'"
        :config="fixWidget(widget)"
      ></SMbutton>

      <Indicator
        v-if="widget.widget == 'indicator'"
        :config="fixWidget(widget)"
      ></Indicator>
    </div>
  </div>

</template>
<script>
export default {
  middleware: 'authenticated',
  name: 'Dashboard',
  data() {
    return {
    } 
  },
  mounted() {
  
  },
  methods: {
    fixWidget(widget){
      var widgetCopy = JSON.parse(JSON.stringify(widget));
      widgetCopy.selectDevice.dId = this.$store.state.selectedDevice.dId;
      widgetCopy.selectDevice.name = this.$store.state.selectedDevice.name;
      widgetCopy.userId = this.$store.state.selectedDevice.userId;
      
      if (widget.widget =="numberchart"){
        widgetCopy.demo = false;
      }

      return widgetCopy;
    }
  }
};
</script>