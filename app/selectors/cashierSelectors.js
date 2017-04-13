import { createSelector } from 'reselect';

// const pattern = (string) => new RegExp(`(${string})+`, 'g');
const getInventoryItems = (state) => state.inventory.items;
const getSelectedGroup = (state) => state.cashier.selectedGroup;
const getSelectedFilter = (state) => state.cashier.selectedFilter;
const getSelectedSort = (state) => state.cashier.selectedSort;
const getCart = (state) => state.cart;

const getCategories = createSelector(
  [getInventoryItems],
  (items) => items.reduce((p, c) => {
    if (p.indexOf(c.category) > -1) {
      return p;
    }

    return [...p, c.category];
  }, [])
);

const getBrands = createSelector(
  [getInventoryItems],
  (items) => items.reduce((p, c) => {
    if (p.indexOf(c.brand) > -1) {
      return p;
    }

    return [...p, c.brand];
  }, [])
);

const getSuppliers = createSelector(
  [getInventoryItems],
  (items) => items.reduce((p, c) => {
    if (p.indexOf(c.supplier) > -1) {
      return p;
    }

    return [...p, c.supplier];
  }, [])
);

export const getItems = createSelector(
  [getInventoryItems, getCart],
  (items, cart) => (
    items.map((item) => {
      if (item.feet) {
        let divisorCounter = 1;
        let getOtherTotalFt = 0;
        const totalFeet = item.feet * item.stock;
        const removeIdFt = (id) => Number(id.replace(/\D\w+(?!-)ft$/, ''));
        const isOtherFtInCart = () => (
          cart.map((item2) => (item2.feet ? removeIdFt(item2.id) : null))
            .indexOf(item.id) > -1
        );

        if (isOtherFtInCart()) {
          getOtherTotalFt = cart.filter((item2) => item2.feet && item.id === removeIdFt(item2.id))
            .map((i) => (i.feet * i.quantity))
            .reduce((p, c) => p + c);
        }

        return [1, 2, 4].map((fraction, i) => {
          const divisor = divisorCounter + i;
          const quotientFeet = item.feet / divisor;
          const quotientPrice = item.sellingPrice / divisor;
          const quotientCost = item.cost / divisor;
          const stock = totalFeet / quotientFeet;
          let sellingPrice = quotientPrice;

          if (i !== 0) {
            if (quotientPrice >= 500) {
              sellingPrice = quotientPrice + 20;
            } else if (quotientPrice >= 1001) {
              sellingPrice = quotientPrice + 30;
            } else {
              sellingPrice = quotientPrice + 10;
            }
          }

          const fractionedItem = {
            ...item,
            id: `${item.id}-${quotientFeet}ft`,
            name: item.name,
            cost: quotientCost,
            feet: quotientFeet,
            totalFeet: totalFeet - getOtherTotalFt,
            stock: stock - (getOtherTotalFt / quotientFeet),
            sellingPrice,
            fraction,
          };
          divisorCounter = divisor;

          return fractionedItem;
        });
      }

      return item;
    }).reduce((p, c) => (Array.isArray(c) ? [...p, ...c] : [...p, c]), [])
  )
);

export const getGridTiles = createSelector(
  [getItems, getCategories, getSuppliers, getBrands, getSelectedGroup, getSelectedFilter, getSelectedSort],
  (items, category, supplier, brand, group, filter, sort) => {
    const tiles = {
      all: items,
      category,
      supplier,
      brand,
    };

    return group
      ? items
          .sort((a, b) => {
            if (sort === 'price_desc') {
              return b.sellingPrice - a.sellingPrice;
            }

            if (sort === 'stock_asc') {
              return a.stock - b.stock;
            }

            if (sort === 'stock_desc') {
              return b.stock - a.stock;
            }

            return a.sellingPrice - b.sellingPrice;
          })
          .filter((item) => item[filter] === group)
      : tiles[filter].sort((a, b) => {
        if (sort === 'price_desc') {
          return b.sellingPrice - a.sellingPrice;
        }

        if (sort === 'stock_asc') {
          return a.stock - b.stock;
        }

        if (sort === 'stock_desc') {
          return b.stock - a.stock;
        }

        return a.sellingPrice - b.sellingPrice;
      });
  }
);

// export const getGridTiles = createSelector(
//   [getItems, getCategories, getSelectedCategory],
//   (items, categories, selectedCategory = 'all') => (
//     selectedCategory ?
//       items.filter((item) => item.category === selectedCategory)
//       : categories
//   )
// );


// export const getSelectedItems = createSelector(
//   [getSelectedIndexes, getInventoryItems],
//   (selectedIndexes, items) => selectedIndexes.map(i => items[i])
// );

// export const getFilteredItems = createSelector(
//   [getFilter, getInventoryItems],
//   (filter, items) => {
//     switch (filter.by) {
//       case 'category':
//         return items.filter(item => item.category === filter.name);
//       case 'brand':
//         return items.filter(item => item.brand === filter.name);
//       case 'supplier':
//         return items.filter(item => item.supplier === filter.name);
//       case 'search':
//         return items.filter(item => pattern(filter.name).test(item.name));
//       default:
//         return items;
//     }
//   }
// );
