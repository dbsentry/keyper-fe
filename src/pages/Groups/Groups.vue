<!--
                        Confidentiality Information

  This module is the confidential and proprietary information of
  DBSentry Corp.; it is not to be copied, reproduced, or transmitted in any
  form, by any means, in whole or in part, nor is it to be used for any
  purpose other than that for which it is expressly provided without the
  written permission of DBSentry Corp.

  Copyright (c) 2020-2021 DBSentry Corp.  All Rights Reserved.

-->
<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <md-card>
          <md-card-header data-background-color="green">
            <h4 class="title">Groups</h4>
            <!-- <p class="category">Here is a subtitle for this table</p> -->
          </md-card-header>
          <md-card-content>
            <groups-table table-header-color="green" :groups="groups" v-on:delete-group="deleteGroup"></groups-table>
            <div class="md-layout md-gutter" :class="'md-alignment-center-space-between'">
              <div class="md-layout-item md-gutter md-xsmall-size-100">
                <p class="card-category">Showing {{from+1}} to {{endOfPage(to, groupCount)}} of {{groupCount}} entries</p>
              </div>  
              <div class="md-layout-item md-gutter md-xsmall-size-100">
                <paginate 
                  :page-count="pageCount"
                  :click-handler="paginate"
                  :prev-text="'<<'"
                  :next-text="'>>'"
                  :container-class="'pagination pagination-no-border pagination-success pagination-primary list-nobull'">
                </paginate>
              </div>  
              <div class="md-layout-item md-gutter md-size-15 md-xsmall-size-100">
                <md-field>
                  <label for="perPage">Per Page</label>
                  <md-select v-model="perPage">
                    <md-option value="20">20</md-option>
                    <md-option value="50">50</md-option>
                    <md-option value="100">100</md-option>
                  </md-select>
                </md-field>
              </div>
            </div>      
          </md-card-content>
        </md-card>
      </div>      
    </div>
  </div>
</template>

<script>
import { GroupsTable } from "@/components";
import Vue from "vue";

export default {
  components: {    
    GroupsTable
  },
  data() {
    return {
      page: 1,
      perPage: 20,
      from: 0,
      to: 0
    }
  },
  computed: {
    group() {
      return this.$store.state.authentication.group;
    },
    groups() {
      Vue.$log.debug("Get groups from store. From: " + this.from + " to: " + this.to);

      var groups_json = this.$store.state.groupStore.all.slice(this.from, this.to);
      var groups_arr = []
      groups_json.forEach(element => {
        var group = {};
        group.cn = element.cn;
        if ("description" in element){
          group.description = element.description;
        }else {
          group.description = "";
        }
        group.members = element.members.map(val => val.split(',')[0].split('=')[1]);
        // group.members = group.members.join(', ')
        groups_arr.push(group);
      });
      Vue.$log.debug(groups_arr)
      // return this.$store.state.groupStore.all;
      return groups_arr;
    },
    pageCount() {
      Vue.$log.debug("Here in pageCount");
      return Math.ceil(this.groupCount/this.perPage);
    },
    groupCount() {
      Vue.$log.debug("Here in groupCount");
      return this.$store.state.groupStore.all.length;
    },
  },
  watch: {
    perPage() {
      Vue.$log.debug("perPage changed");
      this.paginate(1);
    }
  },
  created() {
    this.$store.dispatch('groupStore/getGroups');
    this.to = this.perPage;
  },
  methods: {
    deleteGroup(groupList) {
      Vue.$log.debug("Enter");
      Vue.$log.debug("groupList: " + JSON.stringify(groupList));

      groupList.forEach(element => {
        var groupDel = {};
        groupDel.cn = element;
        Vue.$log.debug("element to del: " + JSON.stringify(groupDel) );
        this.$store.dispatch('groupStore/deleteGroup', { groupDel } );
      });
    },
    paginate(pageNum) {
      this.page = pageNum;
      this.from = (this.page * this.perPage) - this.perPage;
      this.to = (this.page * this.perPage);
    },
    endOfPage(to, groupCount) {
      var endOfPage = to;
      if (to > groupCount) {
        endOfPage = groupCount;
      }
      return endOfPage;
    }
  }
};
</script>
