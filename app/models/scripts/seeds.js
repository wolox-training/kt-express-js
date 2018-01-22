const User = require('../../models').users;

const adminUser = {
  name: 'Kevin',
  lastName: 'Temes',
  email: 'kevin.temes@wolox.com.ar',
  password: '12345678',
  isAdmin: true
};
//console.log(db.Sequelize);
const data = [];

User.findOne({where: {email: adminUser.email}}).then(user => {

  if(!user){
    User.create(adminUser).then(() => process.exit(0));
  }else{
    user.update(adminUser).then(() => process.exit(0));
  }
});

