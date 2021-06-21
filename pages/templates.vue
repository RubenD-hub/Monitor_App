<template>
  <div class="row">
    <SMbutton :config="configButton"></SMbutton>
    <Indicator :config="configIndicator"></Indicator>
    <button @click="sendData1()">SEND</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: false,

      configIndicator: {
        userId: "userId",
        selectDevice: {
          name: "Paciente 1",
          dId: "8888",
          templateName: "Temp Sensor",
          templateId: "24244242424",
          saverRule: false
        },
        varFullName: "Temp",
        variable: "var1",
        icon: "fa-sun",
        column: "col-6",
        widget: "indicator",
        class: "danger"
      },
      configButton: {
        userId: "userId",
        selectDevice: {
          name: "Paciente 1",
          dId: "8888",
          templateName: "Temp Sensor",
          templateId: "24244242424",
          saverRule: false
        },
        varFullName: "Temp",
        variable: "var1",
        icon: "fa-sun",
        column: "col-6",
        widget: "indicator",
        class: "danger",
        message: "{'fanstatus':'stop'}"
      }
    };
  },
  methods: {
    sendData1() {
      this.value = !this.value;
      const toSend = {
        value: this.value
      };
      this.$nuxt.$emit("userId/8888/var1/sdata", toSend);
    }
  }
};
</script>
