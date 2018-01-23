const User = require('../../models').users,
  moment = require('moment');

const addUser = (newUser) => {

  return User.findOne({where: {email: newUser.email}}).then(user => {
    if(!user){
      return User.create(newUser);
    }
    return user.update(newUser);
  });

}

const users = [
  addUser({
    name: 'Kevin',
    lastName: 'Temes',
    email: 'kevin.temes@wolox.com.ar',
    password: '12345678',
    isAdmin: true,
    lastInvalidation: moment()
  })
];

Promise.all(users).then(() => process.exit(0));
