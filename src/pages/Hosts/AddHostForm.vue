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
  <form novalidate @submit.prevent="add">
    <md-card>
      <md-card-header :data-background-color="dataBackgroundColor">
        <h4 class="title">Add Host</h4>
        <p class="category"></p>
      </md-card-header>

      <md-card-content>
        <div class="md-layout md-gutter">
          <div class="md-layout-item md-size-100">
            <md-field :class="getValidationClass('cn')">
              <label>Name</label>
              <md-input v-model="host.cn" @blur="principal()" :disabled="sending"></md-input>
              <span class="md-error" v-if="!$v.host.cn.required">Host name is required</span>
              <span class="md-error" v-else-if="!$v.host.cn.minlength">Invalid Host Name</span>
            </md-field>
          </div>
          <div class="md-layout-item md-size-100">
            <md-field maxlength="5" :class="getValidationClass('description')">
              <label>Description</label>
              <md-textarea v-model="host.description"></md-textarea>
              <span class="md-error" v-if="!$v.host.description.required">Description is required</span>
              <span class="md-error" v-else-if="!$v.host.description.minlength">Invalid Description</span>
              <span class="md-error" v-else-if="!$v.host.description.maxlength">Invalid Description</span>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-100">
            <md-field :class="getValidationClass('principal')">
              <!--
              <label>Principal</label>
              -->
              <md-chips
                v-model="host.principal"
                :disabled="sending"
                :md-auto-insert="true"
                md-placeholder="Principal"
              ></md-chips>
              <span class="md-error" v-if="!$v.host.principal.required"
                >Principal is required</span
              >
            </md-field>
          </div>
          <div class="md-layout-item md-size-50">
            <md-field maxlength="5" :class="getValidationClass('duration')">
              <label>Cert Validity Duration</label>
              <md-input
                v-model="host.duration"
                :disabled="sending"
              ></md-input>
              <span class="md-error" v-if="!$v.host.duration.required"
                >Duration is required</span
              >
              <span class="md-error" v-else-if="!$v.host.duration.between"
                >Duration must be between 1 and 500</span
              >
            </md-field>
          </div>
          <div class="md-layout-item md-size-50">
            <md-field>
              <label for="durationUnit">Hours/Days/Weeks</label>
              <md-select v-model="host.durationUnit" name="durationUnit" id="DurationUnits">
                <md-option value="Hours">Hours</md-option>
                <md-option value="Days">Days</md-option>
                <md-option value="Weeks">Weeks</md-option>
              </md-select>
            </md-field>
          </div>
          <div class="md-layout-item md-size-100 text-right">
            <md-button class="md-raised md-default" v-on:click="cancel">Cancel</md-button>
            <md-button type="submit" class="md-raised md-success" :disabled="sending">Add</md-button>
          </div>
        </div>
      </md-card-content>
    </md-card>
  </form>
</template>
<script>
import Vue from "vue";
import { validationMixin } from "vuelidate";
import { required, minLength, maxLength, between } from "vuelidate/lib/validators";

export default {
  name: "add-host-form",
  mixins: [validationMixin],
  props: {
    dataBackgroundColor: {
      type: String,
      default: ""
    },
    users: {
      type: Array
    }
  },
  data() {
    return {
      host: {
        cn: null,
        description: null,
        principal: [],
        duration: null,
        durationUnit: 'Days'
      },

      sending: false
    };
  },
  validations: {
    host: {
      cn: {
        required,
        minLength: minLength(3)
      },
      description: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(1000)
      },
      principal: {
        required
      },
      duration: {
        required,
        between: between(1, 500)
      },
    }
  },
  computed: {
    alert() {
      return this.$store.state.alert;
    },
    alertMsg() {
      return this.$store.state.alert.message;
    }
  },
  watch: {
    alertMsg(newAlert) {
      Vue.$log.debug("Enter in AddHostForm");
      Vue.$log.debug("Alert Type: " + this.alert.type);

      if (this.alert.type == null) {
        Vue.$log.debug("Nothing in alert");
      } else {
        if (this.alert.type == "success") {
          this.host.cn = null;
          this.host.description = null;
          this.host.principal = [];
          this.host.duration = null;
          this.host.durationUnit = 'Days'
        }
        this.notifyVue(this.alert.type, this.alert.message);
        this.$store.dispatch("alert/clear");
      }
    }
  },
  created() {
    this.$store.dispatch("alert/clear");
  },
  methods: {
    getValidationClass(fieldName) {
      Vue.$log.debug("Enter");
      Vue.$log.debug("fieldName: " + fieldName);

      const field = this.$v.host[fieldName];
      Vue.$log.debug("field: " + JSON.stringify(field));
      Vue.$log.debug("md-invalid: " + field.$invalid && field.$dirty);

      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty
        };
      }
    },
    principal() {
      var princ = this.host.cn === null ? "" : this.host.cn;
      this.host.principal = [princ,];
    },
    add() {
      Vue.$log.debug("Enter");

      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.sending = true;
        this.$emit("add-host", this.host);
        this.sending = false;
      }
    },
    cancel() {
      Vue.$log.debug("Enter");
      this.$emit("cancel-add-host");
    },
    notifyVue(type, msg) {
      Vue.$log.debug("Enter");

      this.$notify({
        message: msg,
        horizontalAlign: "center",
        verticalAlign: "top",
        type: type
      });
    }
  }
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>