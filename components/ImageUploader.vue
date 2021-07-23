<template>
  <div>
    <input type="file" @change="uploadFile" accept=".jpeg,.jpg,image/jpeg" />
  </div>
</template>
<script>
import filenamify from '~/utils/filenamify'
import { unWrap } from '~/utils/fetchUtils'

export default {
  methods: {
    async uploadFile(e) {
      const file = e.target.files[0]
      if (!file) return
      let filename =
        file.name
          .split('.')
          .slice(0, -1)
          .join('.') + Date.now()
      filename = filenamify(filename)
      console.log(filename)
      const options = {
        timestamp: Date.now(),
        public_id: filename
      }

      const response = await unWrap(
        await fetch('/api/cloudinary/signature', {
          method: 'POST',
          body: JSON.stringify(options),
          headers: {
            'Content-Type': 'application/json'
          }
        })
      )
      const signature = response.json.signature
      const readData = fileObj =>
        new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result)
          reader.readAsDataURL(fileObj)
        })

      const data = await readData(file)

      const asset = await this.$cloudinary.upload(data, {
        ...options,
        apiKey: this.$config.cloudinary.apiKey,
        signature
      })
      this.$emit('file-uploaded', asset.public_id)
    }
  }
}
</script>
