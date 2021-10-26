import round from 'lodash.round'

const headerStyle = { textAlign: 'center' }

export default {
  computed: {
    originColumns () {
      return [
        {
          field: 'specModel',
          caption: '设计等级',
          style: headerStyle,
          width: 'auto',
          headerStyle,
          type: 'text',
          readonly: true
        },
        {
          field: 'designQuantity',
          caption: '砼设计量(m³)',
          type: 'price',
          width: 90,
          style: {
            textOverflow: 'ellipsis',
            textAlign: 'center'
          },
          headerStyle,
          readonly: true
        },
        {
          field: rec => {
            return round(rec.cement, 2)
          },
          caption: '水泥(t)',
          style: headerStyle,
          type: 'number',
          width: 75,
          headerStyle,
          readonly: true
        },
        {
          field: rec => {
            return round(rec.flyAsh, 2)
          },
          caption: '粉煤灰(t)',
          style: headerStyle,
          type: 'number',
          width: 75,
          readonly: true,
          headerStyle
        },
        {
          caption: `粗集料(${this.unit})`,
          align: 'center',
          headerStyle,
          columns: [
            {
              field: rec => round(rec.coarseAggregateLevel1, 2),
              type: 'number',
              caption: '5-10mm',
              style: headerStyle,
              width: 80,
              readonly: true,
              headerStyle
            },
            {
              field: rec => round(rec.coarseAggregateLevel2, 2),
              type: 'number',
              caption: '10-20mm',
              style: headerStyle,
              width: 80,
              readonly: true,
              headerStyle
            },
            {
              field: rec => round(rec.coarseAggregateLevel3, 2),
              type: 'number',
              caption: '16-31.05mm',
              style: headerStyle,
              width: 80,
              readonly: true,
              headerStyle
            }
          ]
        },
        {
          caption: `细集料(${this.unit})`,
          align: 'center',
          columns: [
            {
              field: rec => round(rec.fineAggregate, 2),
              type: 'number',
              caption: '0-5mm',
              style: headerStyle,
              width: 80,
              readonly: true,
              headerStyle
            }
          ]
        },
        {
          field: rec => round(rec.waterReducer, 2),
          caption: '减水剂(t)',
          style: headerStyle,
          type: 'number',
          width: 80,
          headerStyle,
          readonly: true
        }
      ]
    },
    theoreticalColumns () {
      return [
        {
          field: 'specModel',
          caption: '设计等级',
          type: 'text',
          width: 'auto',
          headerStyle,
          style: headerStyle,
          readonly: true
        },
        {
          field: rec => {
            return round(rec.cement, 2)
          },
          caption: '水泥(kg)',
          type: 'number',
          width: 80,
          headerStyle,
          style: headerStyle,
          readonly: true
        },
        {
          field: rec => {
            return round(rec.flyAsh, 2)
          },
          caption: '粉煤灰(kg)',
          type: 'number',
          width: 80,
          headerStyle,
          style: headerStyle,
          readonly: true
        },
        {
          caption: '粗集料(kg)',
          headerStyle,
          columns: [
            {
              field: rec => round(rec.coarseAggregateLevel1, 2),
              type: 'number',
              caption: '5-10mm',
              width: 80,
              headerStyle,
              style: headerStyle,
              readonly: true
            },
            {
              field: rec => round(rec.coarseAggregateLevel2, 2),
              type: 'number',
              caption: '10-20mm',
              width: 80,
              headerStyle,
              style: headerStyle,
              readonly: true
            },
            {
              field: rec => round(rec.coarseAggregateLevel3, 2),
              type: 'number',
              caption: '16-31.05mm',
              style: headerStyle,
              width: 80,
              headerStyle,
              readonly: true
            }
          ]
        },
        {
          caption: '细集料(kg)',
          headerStyle,
          columns: [
            {
              field: rec => round(rec.fineAggregate, 2),
              type: 'number',
              caption: '0-5mm',
              style: headerStyle,
              width: 80,
              headerStyle,
              readonly: true
            }
          ]
        },
        {
          field: rec => round(rec.waterReducer, 2),
          caption: '减水剂(kg)',
          style: headerStyle,
          type: 'number',
          width: 80,
          headerStyle,
          readonly: true
        }
      ]
    }
  }
}
