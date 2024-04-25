import fs from 'fs';
//fs - file sistem
class DB {
 constructor(collectionName) {
  this.fileName = `${collectionName}.json`; // convert to json , everything we have 
  this.data = [];
   //this.data: This property holds an array where the data from the collection will be stored.
   // It is initialized as an empty array.
  if (fs.existsSync(this.fileName)) {
   const records = fs.readFileSync(this.fileName, 'utf-8');

   this.data = JSON.parse(records || "[]");
  
  }
  this.collectionName = collectionName;
 }

 push (el) {
  this.data.push(el);
  fs.writeFileSync(this.fileName, JSON.stringify(this.data, null, '  '));
 }

 filter (cb) {
  return this.data.filter(cb);
 }

 map (cb) {
  return this.data.map(cb);
 }

 find (cb) {
  const el = this.data.find(cb);
  if (!el) {
   return el;
  }

  return {
   ...el,
  };
 }

 save (login, data) {
  this.data.forEach((el, i, arr) => {

   if (el.login == login) {
    arr[i] = {
     ...arr[i],
     ...data
    };
   }
  });
  fs.writeFileSync(this.fileName, JSON.stringify(this.data, null, '  '));
 }

 update (cb, data) {
  this.data.forEach((el, i, arr) => {

   if (cb(el)) {
    arr[i] = {
     ...arr[i],
     ...data
    };
   }
  });
  fs.writeFileSync(this.fileName, JSON.stringify(this.data, null, '  '));
 }

 some (cb) {
  return this.data.some(cb);
 }
}


export const USERS = new DB('db_users');
export const ORDERS = new DB('db_orders');
export const ADDRESSES = new DB('db_addresses');

