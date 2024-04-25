import { Router } from 'express';
import { authorizationMiddleware } from '../middlewares.js';
import { ORDERS } from '../db.js';
import { ADDRESSES } from '../db.js';
import geolib from 'geolib'
import {role1} from './users.router.js'

export const OrdersRouter = Router();




const convertToDate = (date) => {

 /***
  * ^ -- початок рядка
  * \d -- перевірка на цифру
  * {N} -- N - разів повторень
  */
 // if (/^\d\d-(01|02|03|....|10|11|12)-\d{4}$/.test(query.createdAt)) { }
 if (!/^\d\d-\d\d-\d{4}$/.test(date)) {
  // return res.status(400).send({ message: `parameter createdAt has wrong format` });
  throw new Error(`parameter createdAt has wrong format`);
 }

 // const res = query.createdAt.split('-');
 // const month = res[1];
 const [day, month, year] = date.split('-');

 const mothsInt = parseInt(month);
 if (mothsInt < 1 || mothsInt > 12) {
  // return res.status(400).send({ message: `parameter createdAt has wrong month value` });

  throw new Error(`parameter createdAt has wrong month value`);
 }

 const result = new Date();
 result.setHours(2);
 result.setMinutes(0);
 result.setMilliseconds(0);
 result.setSeconds(0);

 result.setMonth(mothsInt - 1);
 result.setDate(day);
 result.setFullYear(year);

 return result;
};

const convertToDateMiddleware = (fieldName) => (req, res, next) => {
 const valueString = req.query[fieldName];

 if (!valueString) {
  return next();
 }
 try {
  const value = convertToDate(valueString);
  req.query[fieldName] = value;
  return next();
 } catch (err) {
  return res.status(400)
   .send({ message: err.toString() });
 }
};

OrdersRouter.post('/orders', authorizationMiddleware, (req, res) => {
 const { body, user } = req;

 const createdAt = new Date();
 createdAt.setHours(2);
 createdAt.setMinutes(0);
 createdAt.setMilliseconds(0);
 createdAt.setSeconds(0);




 const order = {
 ...body,
 login: user.login,
 createdAt,
 status: "Active",
 id: crypto.randomUUID()
 };





 //task 3.a

 const fromExists = ADDRESSES.find(el => el.name == order.from)
 const toExists = ADDRESSES.find(el => el.name == order.to)

 if (!(fromExists && toExists )){
  return res.status(400).sendStatus({ message: 'This fields not exist'})
 }


 const distance = geolib.getDistance(
  { latitude : fromExists.location.latitude , longitude: fromExists.location.longitude } ,
  {latitude : toExists.location.latitude , longitude: toExists.location.longitude } 
)
const price = price_of_orders()
//task 3c
function price_of_orders (type) {
  
  if(type === 'standard'){
    return pr = distance * 2.5
  }else if (type === 'lite'){
    return pr = distance * 1.5
  }else if (type === 'universal'){
    return pr = distance * 3
  }else{
    throw new Error('The type is not defined');
  }
  
}

 ORDERS.push(order);
//l add to next field distance (task 3b)
 return res.status(200).send({ message: 'Order was created', order, distance ,price});
});
 





 

/**
* GET /orders?createdAt=05-05-2024
* GET /orders?createdAt= g mhdfbg kjdfbgkjd
*/
OrdersRouter.get('/orders', authorizationMiddleware,
 convertToDateMiddleware('createdAt'),
 convertToDateMiddleware('createdFrom'),
 convertToDateMiddleware('createdTo'),
 (req, res) => {
  const { user, query } = req;

  if (query.createdAt && query.createdFrom && query.createdTo) {
   return res.status(400).send({ message: "Too many parameter in query string" });
  }

  console.log(`query`, JSON.stringify(query));

// to 5t
  let orders = ORDERS.filter(el => el.login === user.login);

  let order = ORDERS.find(el => el.id === params.orderId);

  if(user.role ==='driver' ){
    return order.status == 'Active'
  }
  
  if(user.role ==='admin' ){
    return ORDERS
  }


  if (query.createdAt) {

   try {
    orders = ORDERS.filter(el => {
     const value = new Date(el.createdAt);
     return value.getTime() === query.createdAt.getTime();
    });
   } catch (err) {
    return res.status(400)
     .send({ message: err.toString() });
   }
  }

  if (query.createdFrom) {
   try {
    orders = ORDERS.filter(el => {
     const value = new Date(el.createdAt);
     return value.getTime() >= query.createdFrom.getTime();
    });
   } catch (err) {
    return res.status(400)
     .send({ message: err.toString() });
   }
  }

  if (query.createdTo) {
   try {
    orders = ORDERS.filter(el => {
     const value = new Date(el.createdAt);
     return value.getTime() <= query.createdTo.getTime();
    });
   } catch (err) {
    return res.status(400)
     .send({ message: err.toString() });
   }
  }

  return res.status(200).send(orders);
 });



/**
 * PATCH /orders/fhsdjkhfkdsj
 * PATCH /orders/fhsdjkhfkdsj12
 * PATCH /orders/fhsdjkhfkdsj123
 * PATCH /orders/fhsdjkhfkd123sj
 */

OrdersRouter.patch('/orders/:orderId',authorizationMiddleware, (req, res) => {

 const { params, user } = req;

 let order = ORDERS.find(el => el.id === params.orderId);

 if (!order) {
  return res.status(400).send({ message: `Order with id ${params.orderId} was not found` });
 }

 const { body } = req;
 


 if(user.role ==='customer' && order.status == 'Active' && body.status == 'Rejected'){
  ORDERS.update((el) => el.id === params.orderId, { status: body.status });
  return res.status(200).send({ message: 'change accses' });
 }

 if(user.role ==='driver' && order.status == 'Active' && body.status == 'In progress'){
  ORDERS.update((el) => el.id === params.orderId, { status: body.status });
  return res.status(200).send({ message: 'change accses' });
 }

 if(user.role ==='driver' && order.status == 'In progress' && body.status == 'Done'){
  ORDERS.update((el) => el.id === params.orderId, { status: body.status });
  return res.status(200).send({ message: 'change accses' });
 }

 if(user.role ==='admin' && order.status == 'Active' && body.status == 'Rejected'){
  ORDERS.update((el) => el.id === params.orderId, { status: body.status });
  return res.status(200).send({ message: 'change accses' });
 }
 if(user.role ==='admin' && order.status == 'Active' && body.status == 'In progress'){
  ORDERS.update((el) => el.id === params.orderId, { status: body.status });
  return res.status(200).send({ message: 'change accses' });
 }
 if(user.role ==='admin' && order.status == 'In progress' && body.status == 'Done'){
  ORDERS.update((el) => el.id === params.orderId, { status: body.status });
  return res.status(200).send({ message: 'change accses' });
 }

 if(order.status === 'Done' && (body.status == 'In progress' || body.status == 'Rejected' || body.status == 'Active')){
  return res.status(400).send({ message: 'change not accses' });
 }


 order = ORDERS.find(el => el.id === params.orderId);
 
 return res.status(200).send(order);

 
 







});




