<template>
  <div>
    <v-row>

    <gallery :images="photos" :index="index" @close="index = null"></gallery>

    <div v-if="loading" :lazy-background="gif" style="width: 300px; height: 200px;background-size: cover; background-position: center;">
    </div>
    <div v-else>
      <div 
        class="image"
        v-for="(image, imageIndex) in photos"
        :key="imageIndex"
        @click="index = imageIndex"
        :style="{ backgroundImage: 'url(' + image + ')', width: '300px', height: '200px' }"
      >
      </div>
    </div>
    </v-row>
  </div>
</template>

<script>
  import Gallery from 'vue-gallery';
  export default {
    name:"folder",
    props: ['album', 's3', 'user'],
    components:{
      Gallery
    },
    data() {
      return {
        photoImg:[],
        photos:[],
        myFiles:[],
        index: null,
        loading: true,
        gif:"https://gifimage.net/wp-content/uploads/2018/04/loading-spinner-animated-gif-10.gif"
      }
    },

    mounted() {
      this.getPhotos();
     },
     
    created() {
      setTimeout(() => {
        this.$cookies.set("album", this.album);
      }, 1000);
    },
    
    methods: {
      handleFilePondInit: function () {
        console.log('FilePond has initialized inside component');
        // FilePond instance methods are available on `this.$refs.pond`
      },

      async getPhotos() {
        this.loading =  true
        var albumPhotosKey = this.album;
        const _this = this
        await this.s3.listObjects({
          Bucket: process.env.AWS_BUCKET,
          Delimiter: "/",
          Prefix: _this.user.email+"/"+albumPhotosKey+"/",
          }, function (err, data) {
            console.log(data)
            if (err) {
              return alert('There was an error viewing your album: ' + err.message);
            }
            _this.photos = data.Contents.map(photo =>{
                return "https://appupload.s3.us-east-2.amazonaws.com/"+photo.Key
              })
              _this.loading = false
           })
          
        },
      }
  }

</script>
<style lang="css">
  .image {
    float: left;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    border: 1px solid #ebebeb;
    margin: 5px;
  }
</style>