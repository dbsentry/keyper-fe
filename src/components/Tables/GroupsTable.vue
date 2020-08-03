<template>
  <div>
    <div>
    <md-table v-model="groups" :table-header-color="tableHeaderColor" @md-selected="onSelect" md-sort="cn" md-sort-order="asc" md-card> 
      <md-table-row slot="md-table-row" slot-scope="{ item }" md-selectable="multiple" md-auto-select>
        <md-table-cell md-label="Name" md-sort-by="cn"><router-link :to="{ path: item.cn }" append>{{ item.cn }}</router-link></md-table-cell>            
        <md-table-cell md-label="Members">{{ item.members }}</md-table-cell>
      </md-table-row>
    </md-table>
    </div>
    <div class="md-layout-item md-size-100 text-right">
      <md-button class="md-raised md-success" @click="add">Add</md-button>
      <md-button class="md-raised md-success" @click="del">Delete</md-button>
    </div>
  </div>
</template>

<script>
import Vue from "vue";

export default {
  name: "groups-table",
  props: {
    tableHeaderColor: {
      type: String,
      default: ""
    },
    groups: {
      type: Array
    }
  },
  data() {
    return {
      selected: []
    };
  },
  computed: {
    alert() {
      return this.$store.state.alert;
    },
    alertMsg() {
      return this.$store.state.alert.message;
    },
  },
  watch: {
    alertMsg(newAlert) {
      Vue.$log.debug("Enter");
      Vue.$log.debug("Alert Type: " + this.alert.type);

      if (this.alert.type == null) {
        Vue.$log.debug("Nothing in alert");
      }
      else {
        this.notifyVue(this.alert.type, this.alert.message);
        this.$store.dispatch('alert/clear');
      }
    }
  },
  created () {
    this.$store.dispatch('alert/clear');
  },
  methods: {
    onSelect (items) {
      this.selected = []
      items.forEach(element => {
      this.selected.push(element.cn);
      });
    },
    add () {
      Vue.$log.debug("Enter");

      this.$router.push({name: 'AddGroup'});
    },
    del () {
      Vue.$log.debug("Enter");

      if (JSON.stringify(this.selected) == JSON.stringify([])) {
        Vue.$log.debug("No changes. Ignore click");
      }
      else {
        this.$emit('delete-group', this.selected);
      }
    },
    notifyVue(type, msg) {
      Vue.$log.debug("Enter");

      this.$notify({
        message:
          msg,
        horizontalAlign: 'center',
        verticalAlign: 'top',
        type: type
      });
    } 
  }
};
</script>