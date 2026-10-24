/* Fictional prototype data. Display text for spots, shop types and facts
   lives in i18n.js and is looked up through the keys below. */
(function (root) {
  'use strict';

  var SCOCB = (root.SCOCB = root.SCOCB || {});

  SCOCB.data = {
    boxes: {
      'SCB-SI-03': { area: 'Taman Seri Iskandar', spotKey: 'spot.SCB-SI-03' },
      'SCB-BU-01': { area: 'Bandar Universiti Seri Iskandar', spotKey: 'spot.SCB-BU-01' },
      'SCB-TR-02': { area: 'Taman Tronoh Indah', spotKey: 'spot.SCB-TR-02' }
    },

    shops: [
      { name: 'Kedai Runcit Mawar', typeKey: 'shop.type.grocery' },
      { name: 'Kopi Tepi Sawah', typeKey: 'shop.type.cafe' },
      { name: 'Mesra Mart Seri Iskandar', typeKey: 'shop.type.minimart' }
    ],

    factKeys: ['fact.1', 'fact.2', 'fact.3', 'fact.4']
  };
})(window);
