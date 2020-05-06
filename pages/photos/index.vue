<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" :clipped="$vuetify.breakpoint.lgAndUp" app>
      <v-list dense>
        <template v-for="item in items">
          <v-row v-if="item.heading" :key="item.heading" align="center">
            <v-col cols="6">
              <v-subheader v-if="item.heading">
                {{ item.heading }}
              </v-subheader>
            </v-col>
            <v-col cols="6" class="text-center">
              <a href="#!" class="body-2 black--text">EDIT</a>
            </v-col>
          </v-row>
          <v-list-group v-else-if="item.children" :key="item.text" v-model="item.model"
            :prepend-icon="item.model ? item.icon : item['icon-alt']" append-icon="">
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>
                  {{ item.text }}
                </v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item v-for="(child, i) in item.children" :key="i" link>
              <v-list-item-action v-if="child.icon">
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  {{ child.text }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
          <v-list-item v-else :key="item.text" link>
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                <nuxt-link to="/"> {{ item.text }} </nuxt-link>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar :clipped-left="$vuetify.breakpoint.lgAndUp" app color="blue darken-3" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title style="width: 300px" class="ml-0 pl-4">
        <span class="hidden-sm-and-down">Foto upload AWS</span>
      </v-toolbar-title>
      <v-text-field flat solo-inverted hide-details prepend-inner-icon="mdi-magnify" label="Search"
        class="hidden-sm-and-down" />
      <v-spacer />
      <v-btn icon>
        <v-icon>mdi-apps</v-icon>
      </v-btn>
      <v-btn icon @click="logout">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
      <v-btn icon large>
        <v-avatar size="32px" item>
          <v-img src="https://cdn.vuetifyjs.com/images/logos/logo.svg" alt="Vuetify" />
        </v-avatar>
      </v-btn>
    </v-app-bar>
    <v-content>
      <v-container>
        <v-row>
          <v-col cols="12">
            <file-pond name="test" ref="pond" label-idle="CLIQUE AQUI PARA FAZER UPLOAD DAS SUAS IMAGENS"
              allow-multiple="true" 
              accepted-file-types="image/jpeg, image/png"
              :server="{process}"
              v-on:init="handleFilePondInit"
              @beforeaddfile="beforeAddFile"
              v-bind:files="myFiles" />
          </v-col>
        </v-row>

        <!-- ALBUNS s3 -->
        <v-row v-if="!openAlbum">
          <v-col v-for="album in albums" :key="album" sm="6" md='2' lg="2">
            <div class="folders text-center" @click="selectAlbum(album)" v-lazy-load>
              <v-icon style="font-size: 10rem; color:#5f27cd;">mdi-folder</v-icon>
              <span>{{album}}</span>
            </div>
          </v-col>
        </v-row>

        <folder ref="folder" v-if="openAlbum" :album="selectedAlbum" :user="loggedUser" :s3="s3" />

      </v-container>
    </v-content>
    <v-btn bottom color="pink" dark fab fixed right @click="dialog = !dialog">
      <v-icon>mdi-folder</v-icon>
    </v-btn>
    <v-dialog v-model="dialog" width="800px">
      <v-card>
        <v-card-title class="grey">
          Criar pasta
        </v-card-title>
        <v-container>
          <v-row class="mx-2">
            <v-col class="align-center justify-space-between" cols="12">
              <v-row align="center" class="mr-0">
                <v-text-field placeholder="Nome da pasta" v-model="folder" required />
              </v-row>
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions>
          <v-spacer />
          <v-btn text color="primary" @click="dialog = false">Cancelar</v-btn>
          <v-btn text @click="dialog = false">Criar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>
<style lang="css">
  .folders{
    position:relative;
    cursor: pointer; 
  }
  .folders span{
    position: absolute;
    bottom: 0;
    text-align: center;
    justify-content: center;
    align-items: center;
    display: flex;
    left: 25%;
    right: 25%;
  }
  @media (min-width: 30em) {
    .filepond--item {
      width: calc(50% - .5em) !important;
    }
  }

  @media (min-width: 50em) {
    .filepond--item {
      width: calc(25% - .5em) !important;
    }
  }

</style>
<script>
  import AWS from "aws-sdk";
  // Import Vue FilePond
  import vueFilePond from 'vue-filepond';
  import Folder from '@/components/Folder.vue'

  // Import FilePond styles
  import 'filepond/dist/filepond.min.css';

  // Import image preview plugin styles
  import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';

  // Import image preview and file type validation plugins
  import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
  import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
  import {
    mapGetters
  } from "vuex";
  // Create component
  const FilePond = vueFilePond(
    FilePondPluginFileValidateType,
    FilePondPluginImagePreview
  )

  export default {
    middleware: ['auth'],
    components: {
      FilePond,
      Folder
    },
    props: {
      source: String,
    },

    data: () => ({
      myFiles: [],
      albums:[],
      folder: '',
      dialog: false,
      drawer: null,
      selectedAlbum:'',
      items: [{
          icon: 'mdi-folder',
          text: 'Minhas Pastas'
        },
      ],
      s3: {},
      openAlbum: false,
    }),

    mounted() {
      const _this = this
      this.folder = this.loggedUser.name

      if(this.isAuthenticated){
        // Inicializar o provedor de credenciais do Amazon Cognito
        AWS.config.region = process.env.AWS_REGION; // Região
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
          IdentityPoolId: process.env.AWS_COGNITO_KEY,
        });

        this.s3 = new AWS.S3({
          apiVersion: "2006-03-01",
          Bucket: process.env.AWS_BUCKET,
          accessKeyId: process.env.AWS_ACCESS_KEY,
          secretAccessKey: process.env.AWS_S3_SECRET
        });

        this.s3.listObjects({
          Delimiter: "/",
          Prefix: _this.loggedUser.email+"/" || "/",
          Bucket: process.env.AWS_BUCKET
        }, (err, data)=>{
          this.albums = data.CommonPrefixes.map(function(commonPrefix) {
            var prefix = commonPrefix.Prefix;
            var albumName = decodeURIComponent(prefix.split("/")[1]);
            return albumName
        }); 
      })
    }else{
      this.$router.push("/");
    }
  },

    computed: {
      ...mapGetters(['loggedUser', 'isAuthenticated'])
    },
    methods: {
      logout(){
        this.$axios.post("/auth/logout").then(()=>{
          setTimeout(() => {
            window.location.reload()           
          }, 1500);
        });
      },

      selectAlbum(_album){
        this.selectedAlbum = _album;
        this.openAlbum = true;
      },

      beforeAddFile(){
        if(!this.folder){
          this.dialog = true;
        }
      },
      handleFilePondInit: function () {
        console.log('FilePond has initialized');
        // FilePond instance methods are available on `this.$refs.pond`
      },

      handleFileAdded() {
        /* if(this.folder){
          this.dialog=true
        } */
      },
      handleFileProcessProgress() {},
      handleFileProcessAbort() {},
      handleFileProcessUndo() {},
      handleFileProcess() {
      },
      load(uniqueFileId, load, error) {
        // error();
      },

      fetch(url, load, error, progress, abort, headers) {
        error("Local files only");
      },

      restore(uniqueFileId, load, error, progress, abort, headers) {
        // error();
      },

      revert(uniqueFileId, load, error) {
        // TODO -> AlbumRepository delete photo
        // load();
      },

      process(fieldName, file, metadata, load, error, progress, abort, transfer, options){
          progress(true, 0, 1024);
          this.folder = this.$cookies.get("album") || this.folder
          ? `${this.loggedUser.email}/${this.folder.replace(' ','_')}/${file.name}` 
          : `${this.loggedUser.email}/${file.name}`
          
         this.s3.putObject({
            Bucket: process.env.AWS_BUCKET,
            Body: file,
            ContentType: file.type,
            Key: `${this.folder}`
          }, function (err, data) {
            if (err) {
                error('Something went wrong');
                return;
            }
            load(data.Key);
          }) 
                 
        },

    }
  }

</script>
