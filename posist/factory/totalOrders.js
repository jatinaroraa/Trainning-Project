app.factory("totalOrders", function () {
  var totalOrders = [];
  var totalOrd = [];
  var apiData = [];
  var Recommend = [];
  var items = [];

  // var totalamount = [];
  var totalamount = {
    amount: 0,
    taxes: [],
    totalTax: 0,
  };

  return {
    orders: orders,
    deleteItem: deleteItem,
    newarray: newarray,
    plus: plus,
    minus: minus,
    totalAmount: totalAmount,
    editOrder: editOrder,
    dismiss: dismiss,
    filterOrder: filterOrder,
    recommend: recommend,
  };
  function editOrder(items, amount) {
    totalOrd = [];
    if (items[0].name == undefined) return;

    items.map(function (item) {
      totalOrd.push(item);
      return item;
    });

    totalamount = {
      amount: amount.amount,
      taxes: amount.taxes,
      totalTax: amount.totalTax,
    };
    // var totalamount = totalAmount(amount.amount);
    var data = {
      totalAmount: totalamount,
      totalOrders: totalOrd,
    };
    return data;
  }
  function filterOrder(item) {
    var newItem = [];

    for (var i = 0; i <= item.length / 2; i++) {
      newItem.push(item[i]);
    }

    return newItem;
  }
  function dismiss() {
    console.log(totalOrd, "dissmiss value of item");
    totalOrd = [];
    items = [];

    Recommend = [];
    totalamount = {
      amount: 0,
      taxes: [],
      totalTax: 0,
    };
  }
  function orders(name, price, qty, taxes, tags, id) {
    var exist = totalOrd.find(function (item) {
      return item.name === name;
    });

    console.log(exist, "exist");
    if (exist) {
      return totalOrd;
    }
    var tax = taxes.map(function (item) {
      if (item.applicable == true) {
        var t = (price * item.value) / 100;
        var obj = {
          name: item.name,
          value: item.value,
          applicable: true,
          tax: qty * t,
        };
        return obj;
      } else {
        var obj = {
          name: item.name,
          value: item.value,
          applicable: false,
          tax: 0,
        };
        return obj;
      }
    });
    var totalOrders = {
      id: id,
      name: name,
      price: qty * price,
      qty: qty,
      taxes: tax,
      tags: tags,
    };
    console.log(totalOrd, "totalord");

    totalOrd.push(totalOrders);
    totalAmount(totalOrders.price, totalOrders.taxes);

    return totalOrd;
  }
  function deleteItem(name, qty) {
    var index = totalOrd.findIndex(function (item) {
      return item.name === name;
    });

    totalamount.amount = totalamount.amount - totalOrd[index].price * qty;

    totalOrd[index].taxes.map(function (item) {
      if (item.applicable == true) {
        totalamount.totalTax = totalamount.totalTax - item.tax * qty;
        totalamount.amount = totalamount.amount - item.tax * qty;
        var ind = totalamount.taxes.findIndex(function (tax) {
          return tax.name == item.name;
        });
        // console.log(totalamount.taxes[ind], "minus index");
        totalamount.taxes[ind].totalTax =
          totalamount.taxes[ind].totalTax - item.tax * qty;
      }
    });

    totalOrd.splice(index, 1);

    // totalOrd.pop(index);
    return;
  }
  function recommend(data) {
    var recommend = [];
    var newArray = items.filter(function (items) {
      var d = data.map(function (dataItems) {
        if (items._id == dataItems._id) recommend.push(items);
      });
    });
    console.log(recommend, "recommend");
    return recommend;
  }
  function newarray(data) {
    var dataapi = [];

    var qty = {
      qty: 1,
    };

    var newArray = data.map(function (item) {
      var cata = item.categoryData.map(function (catadata) {
        var menu = catadata.menu.map(function (menu) {
          var newData = {
            _id: menu._id,
            name: menu.name,
            price: menu.price,
            qty: 1,
            tags: menu.tags,
            taxes: menu.taxes,
          };
          items.push(newData);
          return newData;
        });
        return { category: catadata.category, menu: menu };
      });
      return { supercategory: item.supercategory, categoryData: cata };
    });

    apiData = newArray;

    return newArray;
  }
  function updateamount(name, qty) {
    var index = totalOrd.findIndex(function (item) {
      return item.name === name;
    });

    // console.log(totalamount.amount, "delete");
    totalamount.amount = totalamount.amount - totalOrd[index].price;
    totalOrd[index].taxes.map(function (item) {
      if (item.applicable == true) {
        totalamount.totalTax = totalamount.totalTax - item.tax;
        totalamount.amount = totalamount.amount - item.tax;
        var ind = totalamount.taxes.findIndex(function (tax) {
          return tax.name == item.name;
        });
        // console.log(totalamount.taxes[ind], "minus index");
        totalamount.taxes[ind].totalTax =
          totalamount.taxes[ind].totalTax - item.tax;
      }
    });
  }
  function plus(qty, name) {
    var index = totalOrd.findIndex(function (item) {
      return item.name == name;
    });

    qty++;
    totalOrd[index].qty = qty;
    console.log(totalOrd);

    totalAmount(totalOrd[index].price, totalOrd[index].taxes);

    return;
  }
  function minus(qty, name, category) {
    // console.log(qty);
    if (qty == 1) return;
    var index = totalOrd.findIndex(function (item) {
      return item.name == name;
    });
    updateamount(name, totalOrd[index].qty);

    qty--;
    totalOrd[index].qty = qty;

    return;

    return;
  }
  function totalAmount(amount, taxes) {
    var tamount = 0;
    if (amount) {
      tamount += amount;
      var tax = taxes.map(function (bill) {
        if (bill.applicable == true) {
          var tax = (amount * bill.value) / 100;
          totalamount.totalTax += tax;
          tamount += tax;
          console.log(tamount, tax, "new item tax ");
          var found = totalamount.taxes.find(function (item) {
            return item.name == bill.name;
          });
          if (!found) {
            var obj = {
              name: bill.name,
              value: bill.value,
              totalTax: tax,
            };
            totalamount.taxes.push(obj);
          } else {
            var index = totalamount.taxes.findIndex(function (item) {
              if (item.name == bill.name) {
                return item;
              }
            });
            totalamount.taxes[index].totalTax += tax;
            console.log(index, totalamount.taxes, "exist taxes amount");
          }

          var b = {
            name: bill.name,
            tax: tax,
          };
          return b;
        } else {
          var found = totalamount.taxes.find(function (item) {
            return item.name == bill.name;
          });
          if (!found) {
            var obj = {
              name: bill.name,
              value: bill.value,
              totalTax: 0,
            };
            totalamount.taxes.push(obj);
          }
        }
      });
      totalamount.amount += tamount;
    }

    return totalamount;
  }
});
