const Album = require('../models').albums;

exports.purchaseAlbum = (user, album) => {

  return new Promise((resolve, reject) => {

    this.checkPurchasedAlbum(user.id, album.id).then(alreadyPurchased => {

      if(alreadyPurchased){
        resolve(false);
      }else{
        Album.create({
          id: album.id,
          userId: user.id,
          title: album.title
        }).then(success => {
          resolve(true);
        });
      }

    });

  });

};

exports.checkPurchasedAlbum = (userId, albumId) => {

  return Album.findOne({ where: {id: albumId, userId: userId} });

};

exports.getAlbumsByUser = (id) => {

  return Album.findAll({ where: {userId: id} });

};