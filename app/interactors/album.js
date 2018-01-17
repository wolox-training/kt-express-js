const Album = require('../models').albums;

exports.purchaseAlbum = (user, album) => {

  return new Promise((resolve, reject) => {

    Album.findOne({ where: {id: album.id, userId : user.id} }).then(alreadyPurchased => {

      if(alreadyPurchased){
        resolve(false);
      }else{
        Album.create({
          id: album.id,
          userId: user.id,
          title: album.title
        }).then(success => {
          resolve(success);
        });
      }

    });

  });

};