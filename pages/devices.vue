<template>
  <div>
    <!-- Section to add devices  -->
    <div class="row">
      <card>
        <div slot="header">
          <h4 class="card-title">Add new Device</h4>
        </div>

        
        <div class="row">
          <!-- Device name column -->
          <div class="col-4">
            <base-input
              label="Device Name"
              type="text"
              placeholder="Ex: Temp, Frec ..."
              v-model="newDevice.name"
            ></base-input>
          </div>

          <!-- Device Id column -->
          <div class="col-4">
            <base-input
              label="Device Id"
              type="text"
              placeholder="Ex: 1111-2222"
              v-model="newDevice.dId"
            ></base-input>
          </div>

          <!-- Template column -->
          <div class="col-4">
            <base-input label="Select Template">
              <el-select
                v-model="selectedIndexTemplate"
                placeholder="Select Template"
                class="select-primary"
              >
                <el-option
                  v-for="(template, index) in templates"
                  :key="template._id"
                  class="text-dark"
                  :value="index"
                  :label="template.name"
                ></el-option>

              </el-select>

            </base-input>
          </div>

        </div>

        <!-- Add button -->
        <div class="row pull-right">

          <div class="col-12">
            <base-button
              @click="createNewDevice()"
              type="primary"
              class="mb-3"
              size="sm"
            >
              <i class="tim-icons icon-double-right"></i> Add
            </base-button>
          </div>
          
        </div>

      </card>
    </div>

    <!-- Devices Table -->
    <div class="row">
      <card>

        <div slot="header">
          <h4 class="card-title">Devices</h4>
        </div>

        <!-- Device Table -->
        <el-table :data="$store.state.devices">
          
          <!-- Index column -->
          <el-table-column
            min-width="50"
            type="index"
            label="#"
          ></el-table-column>

          <!-- Name column   -->
          <el-table-column prop="name" label="Name"></el-table-column>

          <!-- Id column   -->
          <el-table-column prop="dId" label="Device-Id"></el-table-column>

          <!-- Template column   -->
          <el-table-column prop="templateName" label="Template"></el-table-column>

          <!-- Action column   -->
          <el-table-column label="Actions">
            <div slot-scope="{ row, $index }">

              <!-- Database saver indicator    -->
              <el-tooltip content="Saver Status Indicator" style="margin-right:10px">
                  <i class="fas fa-database" :class="{
                    'text-success': row.saverRule.status,
                    'text-dark': !row.saverRule.status}"></i>
              </el-tooltip>

              <!-- Switch save rule status   -->
              <el-tooltip content="Database Saver">
                <base-switch
                  color="black"
                  on-text="On"
                  off-text="Off"
                  @click="updateSaverRuleStatus(row.saverRule)"
                  :value="row.saverRule.status"
                ></base-switch>
              </el-tooltip>

              <!-- Delete button     -->
              <el-tooltip content="Delete" :open-delay="300" placement="top">
                <base-button
                  type="danger"
                  size="sm"
                  icon
                  @click="deleteDevice(row)"
                >
                  <i class="tim-icons icon-simple-remove"></i>
                </base-button>
              </el-tooltip>
            </div>
          </el-table-column>
        </el-table>
      </card>
    </div>


    <Json :value="$store.state.devices"></Json>

  </div>
</template>

<script>
import { Table, TableColumn } from "element-ui";
import { Select, Option } from "element-ui";

export default {
  middleware: "authenticated",
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Option.name]: Option,
    [Select.name]: Select
  },
  data() {
    return {
      templates: [],
      selectedIndexTemplate: null,
      newDevice: {
        name: "",
        dId: "",
        templateId: "",
        templateName: ""
      }
    };
  },
  mounted(){
    // Get all devices
    this.$store.dispatch("getDevices");
    this.getTemplates();
  },
  methods: {
    updateSaverRuleStatus(rule) {
      var ruleCopy = JSON.parse(JSON.stringify(rule));
      ruleCopy.status = !ruleCopy.status;

      const toSend = { 
        rule: ruleCopy 
      };
      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token
        }
      };
      this.$axios.put("/saver-rule", toSend, axiosHeaders).then(res => {
        if (res.data.status == "success" && ruleCopy.status == true) {
            this.$store.dispatch("getDevices");
            this.$notify({
              type: "success",
              icon: "tim-icons icon-check-2",
              message: " Device Saver Status On"
            });
        }
        if (res.data.status == "success" && ruleCopy.status == false) {
            this.$store.dispatch("getDevices");
            this.$notify({
              type: "warning",
              icon: "tim-icons icon-check-2",
              message: " Device Saver Status Off"
            });
            }

          return;
      })
      .catch(e => {
        console.log(e);
        this.$notify({
          type: "danger",
          icon: "tim-icons icon-alert-circle-exc",
          message: " Error updating saver rule status"
        });
        return;
      });
    },

    deleteDevice(device) {
      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.accessToken
        },
        params: {
          dId: device.dId
        }
      };
      this.$axios
        .delete("/device", axiosHeaders)
        .then(res => {
          if (res.data.status == "success") {
            this.$notify({
              type: "success",
              icon: "tim-icons icon-check-2",
              message: device.name + " deleted!"
            });
          }
          $nuxt.$emit("time-to-get-devices");
          return;
        })
        .catch(e => {
          console.log(e);
          this.$notify({
            type: "danger",
            icon: "tim-icons icon-alert-circle-exc",
            message: " Error deleting " + device.name
          });
          return;
        });
    },

    //new device
    
    createNewDevice() {
      if (this.newDevice.name == "") {
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: " Device Name is Empty :("
        });
        return;
      }
      if (this.newDevice.dId == "") {
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: " Device ID is Empty :("
        });
        return;
      }
      if (this.selectedIndexTemplate == null) {
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: " Tempalte must be selected"
        });
        return;
      }
      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token
        }
      };
      //ESCRIBIMOS EL NOMBRE Y EL ID DEL TEMPLATE SELECCIONADO EN EL OBJETO newDevice
      this.newDevice.templateId = this.templates[
        this.selectedIndexTemplate
      ]._id;
      this.newDevice.templateName = this.templates[
        this.selectedIndexTemplate
      ].name;
      const toSend = {
        newDevice: this.newDevice
      };
      this.$axios
        .post("/device", toSend, axiosHeaders)
        .then(res => {
          if (res.data.status == "success") {
            this.$store.dispatch("getDevices");
            this.newDevice.name = "";
            this.newDevice.dId = "";
            this.selectedIndexTemplate = null;
            this.$notify({
              type: "success",
              icon: "tim-icons icon-check-2",
              message: "Success! Device was added"
            });
            return;
          }
        })
        .catch(e => {
          if (
            e.response.data.status == "error" &&
            e.response.data.error.errors.dId.kind == "unique"
          ) {
            this.$notify({
              type: "warning",
              icon: "tim-icons icon-alert-circle-exc",
              message:
                "The device is already registered in the system. Try another device"
            });
            return;
          } else {
            this.showNotify("danger", "Error");
            return;
          }
        });
    },

    //Get Templates
    async getTemplates() {
      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token
        }
      };
      try {
        const res = await this.$axios.get("/template", axiosHeaders);
        console.log(res.data);
        if (res.data.status == "success") {
          this.templates = res.data.data;
        }
      } catch (error) {
        this.$notify({
          type: "danger",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Error getting templates..."
        });
        console.log(error);
        return;
      }
    },
    
    // Remove device
    deleteDevice(device) {
      const axiosHeader = {
        headers: {
          token: this.$store.state.auth.token
        },
        params: {
          dId: device.dId
        }
      };
      this.$axios
        .delete("/device", axiosHeader)
        .then(res => {
          if (res.data.status == "success") {
            this.$notify({
              type: "success",
              icon: "tim-icons icon-check-2",
              message: device.name + " deleted!"
            });
            this.$store.dispatch("getDevices");
          }
          // return;
          
        })
        .catch(e => {
          console.log(e);
          this.$notify({
            type: "danger",
            icon: "tim-icons icon-alert-circle-exc",
            message: " Error deleting " + device.name
          });
          // return;
        });
    },
  }
};
</script>
