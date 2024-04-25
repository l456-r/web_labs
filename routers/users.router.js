import { USERS } from '../db.js';

import { Router } from 'express'


export const UsersRouter = Router()

/**
 * POST -- create resource
 * req -> input data
 * res -> output data
 */



//  export const role1 = function(users){
//     const Customer = users.Customer;
//     return { Customer };
// }

// const role2 = function(users){
//     const Driver = users.Driver;
//     return { Driver };
// }

// const role3 = function(users){
//     const Admin = users.Admin;
//     return { Admin };
// }


// const orderForRole1 = {
//   ...body,
//   login: user.login,
//   createdAt,
//   status: "Active",
//   id: crypto.randomUUID()
//   };


// const orderForRole2 = {
//   ...body,
//   login: user.login,
//   createdAt,
//   status: "Active",
//   id: crypto.randomUUID()
//   };


//     const orderForRole3 = {
//       ...body,
//       createdAt,
//       id: crypto.randomUUID()
//       };



// if(role2){
//   return orderForRole2
// }


// if(role3){
//   return orderForRole3
// }

UsersRouter.post('/admin', (req, res) => {

  const isUserExist = USERS.some(el => el.login === body.login);
  if (isUserExist) {
    return res.status(400).send({ message: `user with login ${body.login} already exists` });
  }
  USERS.push({...body, role: 'admin'});
  res.status(200).send({ message: 'User was created' });
});





UsersRouter.post('/drivers', (req, res) => {
 
 
   const isUserExist = USERS.some(el => el.login === body.login);
   if (isUserExist) {
     return res.status(400).send({ message: `user with login ${body.login} already exists` });
   }
     
   USERS.push({...body, role: 'driver'});
   res.status(200).send({ message: 'User was created' });
 });



 

UsersRouter.post('/users', (req, res) => {
    const { body } = req;
  
    console.log(`body`, JSON.stringify(body));
  
    const isUserExist = USERS.some(el => el.login === body.login);
    if (isUserExist) {
      return res.status(400).send({ message: `user with login ${body.login} already exists` });
    }
  
    USERS.push({...body, role: 'customer'});
  
    res.status(200).send({ message: 'User was created' });
  });




  
  UsersRouter.get('/users', (req, res) => {
    const users = USERS.map(user => {
      const { password, ...other } = user;
      return other;
    });
    return res
      .status(200)
      .send(users);
  });
  
  UsersRouter.post('/login', (req, res) => {
    const { body } = req;
  
    const user = USERS
      .find(el => el.login === body.login && el.password === body.password);
  
    if (!user) {
      return res.status(400).send({ message: 'User was not found' });
    }

    const token = crypto.randomUUID();

    user.token = token;
    USERS.save(user.login, { token });
  
    return res.status(200).send({
      token,
      message: 'User was login'
    });
  });