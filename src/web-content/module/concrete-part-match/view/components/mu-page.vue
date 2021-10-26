<template>
  <mu-h-box class="custom-page-bar">
    <mu-button
      v-if="currentPage!==1"
      title="上一页"
      icon="key-left"
      @click="pagePrevious" />
    <mu-button
      v-for="(item, index) in pages"
      :key="`${index}-${Math.ceil(Math.random() * 10)}`"
      :active="item === currentPage"
      :caption="String(item)"
      @click="changePage(item)" />
    <mu-button
      v-if="currentPage!==maxPage"
      title="下一页"
      icon="key-right"
      @click="pageNext" />
    <mu-combo-box
      v-model="localLimit"
      style="width: 120px;"
      popup-position="top"
      :clearable="false"
      :options="limitOptions"
      @change="selectPages" />
    <mu-button-editor
      v-if="maxPage > 9"
      v-model.trim="jumpPage"
      :clearable="false"
      icon-class=""
      icon=""
      type="number"
      class="custom-input"
      @change="inputChange" />
    <mu-button
      v-if="maxPage > 9"
      caption="跳转"
      @click="jump" />
  </mu-h-box>
</template>

<script>
  export default {
    props: {
      dataLength: {
        type: Number,
        default: 0
      },
      pageSizeOptions: {
        type: Array,
        default: () => [50, 100]
      },
      offset: {
        type: Number,
        default: 0
      },
      limit: {
        type: Number,
        default: 50
      }
    },
    data () {
      return {
        maxPage: 0,
        pages: [],
        limitOptions: [],
        localLimit: 50,
        jumpPage: 1
      }
    },
    computed: {
      currentPage () {
        return Math.floor(this.offset / this.limit) + 1
      }
    },
    watch: {
      dataLength () {
        this.calculatePageNumber()
      },
      limit (val) {
        if (!val) {
          this.$emit('update:limit', 50)
        } else {
          this.localLimit = val
          this.calculatePageNumber()
        }
      },
      offset () {
        this.calculatePageNumber()
      }
    },
    mounted () {
      if (!this.limit) {
        this.$emit('update:limit', 50)
      } else {
        this.localLimit = this.limit
        if (this.offset > this.dataLength) {
          this.$emit('update:offset', 0)
        } else {
          this.calculatePageNumber()
        }
      }
      this.limitOptions = this.pageSizeOptions.map((item, index) => {
        return {
          value: item,
          label: `${item}条/页`
        }
      })
    },
    methods: {
      pagePrevious () {
        this.$emit('update:offset', (this.currentPage - 2) * this.limit)
      },
      pageNext () {
        this.$emit('update:offset', (this.currentPage) * this.limit)
      },
      changePage (val) {
        if (val !== '...') {
          this.$emit('update:offset', (val - 1) * this.limit)
        }
      },
      calculatePageNumber () {
        this.maxPage = Math.ceil(this.dataLength / this.limit)
        this.pages = []
        if (this.maxPage > 9) {
          if (this.currentPage < 6) {
            let count = 6
            while (count > 0) {
              this.pages.unshift(count--)
            }
            this.pages.push('...')
            this.pages.push(this.maxPage)
          } else if (this.currentPage >= this.maxPage - 3) {
            let count = 5
            while (count > 0) {
              count--
              this.pages.push(this.maxPage - count)
            }
            this.pages.unshift('...')
            this.pages.unshift(1)
          } else {
            this.pages.push(1)
            this.pages.push('...')
            this.pages.push(this.currentPage - 2)
            this.pages.push(this.currentPage - 1)
            this.pages.push(this.currentPage)
            this.pages.push(this.currentPage + 1)
            this.pages.push('...')
            this.pages.push(this.maxPage)
          }
        } else {
          let tempNum = this.maxPage
          while (tempNum > 0) {
            this.pages.unshift(tempNum--)
          }
        }
      },
      selectPages () {
        this.$emit('update:limit', this.localLimit)
      },
      jump () {
        this.$emit('update:offset', (this.jumpPage - 1) * this.limit)
      },
      inputChange (val) {
        if (!this.jumpPage || this.jumpPage < 1) {
          this.jumpPage = 1
        } else if (this.jumpPage > this.maxPage) {
          this.jumpPage = this.maxPage
        }
      }
    }
  }
</script>

<style lang="postcss">
.custom-page-bar {
  justify-content: flex-end;
  padding-right: 8px;
  & > button {
    margin-right: 8px;
    justify-content: flex-end;
    min-width: 36px;
  }
  .custom-input {
    margin: 0 8px;
    width: 72px;
  }
}
</style>
