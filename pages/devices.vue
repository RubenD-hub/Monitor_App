<template>
  <div>
    <!-- Section to add devices  -->
    <div class="row">
      <card>
        <div slot="header">
          <h4 class="card-title">Add new Device</h4>
        </div>

        <!-- Device name column -->
        <div class="row">
          <div class="col-4">
            <base-input
              label="Device Name"
              type="text"
              placeholder="Ex: Temp, Frec ..."
            ></base-input>
          </div>

          <!-- Device Id column -->
          <div class="col-4">
            <base-input
              label="Device Id"
              type="text"
              placeholder="Ex: 1111-2222"
            ></base-input>
          </div>

          <!-- Template column -->
          <div class="col-4">
            <base-input label="Select Template">
              <el-select
                value="1"
                placeholder="Select Template"
                class="select-primary"
              >
                <el-option
                  class="text-dark"
                  value="Template 1"
                  label="Template 1"
                ></el-option>

                <el-option
                  class="text-dark"
                  value="Template 2"
                  label="Template 2"
                ></el-option>

              </el-select>

            </base-input>
          </div>

        </div>

        <!-- Add button -->
        <div class="row pull-right">

          <div class="col-12">
            <base-button simple type="primary" class="mb-3" size="sm">
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
        <el-table :data="devices">
          
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
                  <i class="fas fa-database" :class="{'text-success' : row.saverRule}"></i>
              </el-tooltip>

              <!-- Switch save rule status   -->
              <el-tooltip content="Database Saver">
                <base-switch
                  color="black"
                  :value="row.saverRule"
                  on-text="On"
                  off-text="Off"
                  @click="updateSaverRuleStatus($index)"
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


    <Json :value="devices"></Json>

  </div>
</template>

<script>
import { Table, TableColumn } from "element-ui";
import { Select, Option } from "element-ui";

export default {
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Option.name]: Option,
    [Select.name]: Select
  },
  data() {
    return {
      devices: [
        {
          name: "Temp",
          dId: "8888",
          templateName: "Temp Sensor",
          templateId: "24244242424",
          saverRule: false
        },
        {
          name: "SaO2",
          dId: "2222",
          templateName: "SaO2 Sensor",
          templateId: "2432415435",
          saverRule: true
        },
        {
          name: "FR",
          dId: "7777",
          templateName: "FR Sensor",
          templateId: "5345635364",
          saverRule: false
        }
      ]
    };
  },
  methods: {
    // Remove device
    deleteDevice(device) {
      alert("Deleting " + device.name);
    },
    // Modify the state of the save rule
    updateSaverRuleStatus(index) {
      this.devices[index].saverRule = !this.devices[index].saverRule;
    }
  }
};
</script>
