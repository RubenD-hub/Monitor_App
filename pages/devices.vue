<template>
  <div>
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
          <base-input label="Device Id" type="text" placeholder="Ex: 1111-2222">
          </base-input>
        </div>

        <div class="col-4">
          <base-input label="Select Template">

            <el-select value="1" placeholder="Select Template" class="select-primary">
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
              <base-button simple type="primary" class="mb-3" size="lg">
                <i class="tim-icons icon-double-right"></i> Add
              </base-button>
          </div>
      </div>
    </card>
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
  }
};
</script>
