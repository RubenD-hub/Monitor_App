<template>
  <div>
    <!-- Section to add devices  -->
    <div class="row">
      <card>
        <div slot="header">
          <h4 class="card-title">Add new Device</h4>
        </div>

        <div class="row">
          <div class="col-4">
            <base-input
              label="Device Name"
              type="text"
              placeholder="Ex: Temp, Frec ..."
            >
            </base-input>
          </div>

          <div class="col-4">
            <base-input
              label="Device Id"
              type="text"
              placeholder="Ex: 1111-2222"
            >
            </base-input>
          </div>

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

        <el-table :data="devices">
            <el-table-column min-width="50" type="index" label="#"></el-table-column>
          <el-table-column prop="name" label="Name"></el-table-column>
          <el-table-column prop="dId" label="Device-Id"></el-table-column>
          <el-table-column
            prop="templateName"
            label="Template"
          ></el-table-column>
          <el-table-column label="Actions">
            <div slot-scope="{row, $index}">
                <el-tooltip content="Delete" :open-delay="300" placement="top">
                    <base-button type="danger" size="sm" icon @click="deleteDevice(row)">
                        <i class="tim-icons icon-simple-remove"></i>
                    </base-button>
                </el-tooltip>
            </div>

          </el-table-column>
        </el-table>
      </card>
    </div>
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
          templateId: "24244242424"
        },
        {
          name: "SaO2",
          dId: "2222",
          templateName: "SaO2 Sensor",
          templateId: "2432415435"
        },
        {
          name: "FR",
          dId: "7777",
          templateName: "FR Sensor",
          templateId: "5345635364"
        }
      ]
    };
  },
  methods: {
      deleteDevice(device){
          alert("Deleting " + device.name)

      }
  }
};
</script>
