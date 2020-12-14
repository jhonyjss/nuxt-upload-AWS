<template>
  <v-app id="inspire">
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-toolbar color="warning" dark flat>
                <v-toolbar-title
                  >Faça o login com seu usuário e senha</v-toolbar-title
                >
                <v-spacer />
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                    v-model="fields.email"
                    label="Login"
                    name="login"
                    prepend-icon="person"
                    type="text"
                  />
                  <v-text-field
                    v-model="fields.password"
                    id="password"
                    label="Password"
                    name="password"
                    prepend-icon="lock"
                    type="password"
                  />
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn color="primary" @click="loggin()">Login</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  middleware: ["auth"],
  props: {
    source: String
  },
  data() {
    return {
      fields: {
        email: "",
        password: ""
      }
    };
  },

  beforeMount() {
    if (this.isAuthenticated) {
      this.$router.push("/photos");
    }
  },

  computed: {
    ...mapGetters(["loggedUser", "isAuthenticated"])
  },

  methods: {
    async loggin() {
      await this.$auth.loginWith("local", {
        data: this.fields
      });

      this.$router.push("/photos");
    }
  }
};
</script>
