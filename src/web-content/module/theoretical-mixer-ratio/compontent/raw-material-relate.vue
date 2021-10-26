<template>
  <mu-dialog
    :visible="visible"
    model-control="external"
    width="725px"
    height="591px"
    class="rawMaterial"
    :draggable="true"
    title="原材料仓关联"
    :buttons="buttons"
    @change="change"
    @show="openDlg"
    @buttonclick="onButtonClick">
    <mu-h-box size="1" style="height: 100%">
      <mu-v-box size="30%"
        border-right>
        <mu-bar class="pad-16" style="height: 48px"
          border-bottom>
          <span class="mu-module-title">
            材料列表
          </span>
        </mu-bar>
        <mu-v-box class="material_info_box">
          <div class="material_name">材料名称</div>
          <ul>
            <li v-for="(item, index) in materialLsit"
              :key="index"
              :style="{ 'background': activeMaterial === item ? '#f4fbff' : '#fff'}"
              @click="changeMaterial(item)">
              {{ item.name }}
            </li>
          </ul>
        </mu-v-box>
      </mu-v-box>
      <mu-v-box size="70%">
        <mu-bar class="mu-bar-pad" style="height: 48px"
          border-bottom>
          <span class="mu-module-title">
            原材料仓列表
          </span>
          <mu-space />
          <mu-search-box
            v-model="searchValue"
            style="width: 180px;"
            placeholder="按名称搜索"
            @search="onSearch"
            @change="onSearch" />
        </mu-bar>
        <mu-v-box class="grid">
          <kaka-grid
            ref="rawMaterialGrid"
            class="mu-absolute-fit"
            :columns="columns"
            :records="records"
            :theme="{highlightBorderColor: 'transparent'}"
            @cellcheck="selectItems"
            @celluncheck="selectItems" />
        </mu-v-box>
      </mu-v-box>
    </mu-h-box>
  </mu-dialog>
</template>

<script>
  import { notify } from '@mctech/mussel'
  import { mapActions } from 'vuex'
  import { compactObj } from '../../../utils/math.js'

  export default {
    model: {
      prop: 'visible',
      event: 'change'
    },
    props: {
      visible: Boolean
    },
    data () {
      return {
        searchValue: '',
        records: [],
        copyRecords: [],
        buttons: [
          { caption: '取消', key: 'cancel' },
          { caption: '确定', key: 'ok', buttonType: 'primary' }
        ],
        activeMaterial: null
      }
    },
    computed: {
      materialLsit () {
        return [
          { id: 1, name: '水泥' },
          { id: 2, name: '粉煤灰' },
          { id: 3, name: '粗集料' },
          { id: 4, name: '细集料' },
          { id: 5, name: '减水剂' }
        ]
      },
      columns () {
        return [
          {
            field: '_selected',
            type: 'checkBox',
            headerType: null,
            width: 50,
            readonly: rec => rec.materialName && rec.materialName !== this.activeMaterial.name,
            style: (rec) => {
              return rec.materialName && rec.materialName !== this.activeMaterial.name
                ? { checkBgColor: '#999', borderColor: '#999' } : {}
            }
          },
          { field: rec => `拌合站${rec.mixerNo}`, caption: '拌合站', align: 'center', width: 208, minWidth: 150 },
          { field: 'feedBin', caption: '原材料仓', align: 'center', width: 'auto', minWidth: 150 }
        ]
      }
    },
    methods: {
      ...mapActions([
        'getMixerNoAndMaterialName',
        'setMaterialMixingStationRelation'
      ]),
      change (value) {
        this.$emit('change', value)
      },
      async openDlg () {
        this.searchValue = ''
        const data = await this.getMixerNoAndMaterialName()
        this.records = data.map(v => {
          return {
            ...v,
            _selected: v.id && v.materialName
          }
        })
        this.copyRecords = [...this.records]
        this.activeMaterial = this.materialLsit[0]
        this.$refs.rawMaterialGrid.invalidate()
      },
      changeMaterial (item) {
        this.activeMaterial = item
        this.$refs.rawMaterialGrid.invalidate()
      },
      async onButtonClick ({ key }) {
        // const vm = this.$refs.rawMaterialGrid

        if (key === 'ok') {
          // const models = vm.getSelectedRecords()
          const data = this.copyRecords.filter(l => l._selected).map(l => {
            return compactObj(l)
          })
          console.log(data)
          const ids = this.copyRecords.filter(l => l.id && !l.materialName).map(l => l.id)
          const isRelated = await this.setMaterialMixingStationRelation({ ids, data })

          if (isRelated) {
            notify('success', '操作成功')
            this.change(false)
          }
        } else {
          this.change(false)
        }
      },
      onSearch (value) {
        if (value) {
          this.records = this.copyRecords.filter(l => {
            return l.feedBin.includes(value) || l.mixerNo.toString().includes(value)
          })
        } else {
          this.records = this.copyRecords
        }
      },
      selectItems (data, vm) {
        const { record } = data
        record.materialName = null
        if (record._selected) {
          record.materialName = this.activeMaterial.name
        }
        this.copyRecords.forEach(v => {
          if (v.mixerNo === record.mixerNo && v.feedBin === record.feedBin) {
            v.materialName = record.materialName
          }
        })
      }
    }
  }
</script>
<style lang="postcss" scoped>
  .rawMaterial {
    .mu-dialog-body {
      padding: 0;
    }
    .mu-dialog-footer {
      border-top: 1px solid #ebecf0;
    }
    .grid {
      width: calc(100% - 32px);
      height: calc(100% - 82px);
      margin: 16px auto;
    }
    .material_info_box {
      .material_name {
        height: 48px;
        line-height: 48px;
        border-bottom: 1px solid #ebecf0;
        text-align: center;
        background-color: #f5f5f5
      }
      ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
        li {
          height: 40px;
          line-height: 40px;
          text-align: center;
          border-bottom: 1px solid #ebecf0;
          cursor: pointer;
        }
      }
    }
  }
</style>
