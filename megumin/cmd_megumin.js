module.exports = function(param, args) {
let megumins = ["https://img00.deviantart.net/57c8/i/2016/090/2/d/megumin_the_loli_mage_by_deru06-d9x9mbl.png",
               "https://pm1.narvii.com/6052/583ebb22f4530dbb2981399b8e8491aee9707fb2_hq.jpg",
               "https://pm1.narvii.com/6073/f9d5c107253f34281ad9599517142eec75eda66c_hq.jpg",
               "https://pm1.narvii.com/6251/1180c6b0330861a55f74a9da3cd817744c084b97_hq.jpg",
               "https://pm1.narvii.com/6251/78722a4936fc903fb845de3254dd3f9d5a7bced7_hq.jpg",
               "https://pm1.narvii.com/6251/89e8739c63a052c8d0eda20b0ebda079fa7d7fec_hq.jpg",
               "https://pm1.narvii.com/6251/b5bcc5c2d9b30c2c875853564e2425b44b7bd7f4_hq.jpg",
               "https://pm1.narvii.com/6251/e11f73c14664289bebe4bc2bc2d8ead1b932331a_hq.jpg",
               "https://pm1.narvii.com/6251/2b17d77d9ab7a9590581478a11028d23f7e90812_hq.jpg",
               "https://pm1.narvii.com/6251/9d610ae778538f8f7a32547ffc27f5ce6bd69dc2_hq.jpg",
               "http://mp-su.com/i/92e3b10.jpg",
               "https://johnjohns1.fjcdn.com/comments/Ive+got+a+fix+for+people+like+you+_1a4d4387d9f04c86e9026533c268207e.jpg",
               "https://johnjohns1.fjcdn.com/comments/Thats+an+odd+way+of+spelling+megumin+_2ef3315177f8f8bf135a5b2e0b7e2c68.jpg",
               "https://johnjohns1.fjcdn.com/comments/I+dont+even+watch+the+show+and+i+like+megumin+_42aa8187f2c45ee2696bd86e27ef6a1b.jpg",
               "https://i.redd.it/nz2ecwpyp3k01.jpg",
               "https://scontent-ort2-2.cdninstagram.com/vp/a44f220f0bfe28a2e3776036510adeeb/5C1CE9F3/t51.2885-15/e35/39971210_2181600702108309_8878955288325356918_n.jpg",
               "https://i.pinimg.com/originals/08/7d/72/087d724e325436f27522a5d3a7f72d9b.png",
               "https://myanimelist.cdn-dena.com/images/characters/14/349249.jpg",
               "https://cdn.discordapp.com/attachments/423522566246760449/486851855704653830/EmlnPVI5Em8qvhj3MntTL5Qwq_JVRp5f2X2D3YPfCvw.png",
               "https://cdn.discordapp.com/attachments/476892731554136076/487645629460381748/9MV0zU2tLx9POt_FjTcVWsu_GFFrWcUZAOJLEaUBPZI.png",
               "https://i.pximg.net/img-original/img/2016/04/15/17/38/36/56362977_p0.png",
               "https://i.pximg.net/img-original/img/2018/05/11/10/32/45/68689412_p0.jpg",
               "https://i.pximg.net/img-original/img/2018/07/08/22/56/52/69604043_p0.jpg",
               "https://i.pximg.net/img-original/img/2018/08/25/14/09/09/70375703_p0.png",
               "https://i.pximg.net/img-original/img/2018/09/07/14/46/46/70580313_p0.jpg",
               "https://i.redd.it/0ddyqsins4n01.jpg"];
  var randomness = Math.floor(Math.random() * (megumins.length));
  var img = megumins[randomness];
  const data = {
  "embed": {
    "description": "Here is a lovely picture of me! ^^ ("+randomness+"/"+megumins.length+")",
    "color": 13178425,
    "timestamp": new Date(),
    "footer": {
      "icon_url": "https://cdn.discordapp.com/avatars/255397678492418048/a8e516d198c913fb897aa592ce21e260.png",
      "text": "~megumin"
    },
    "image": {
      "url": img
    },
    "author": {
      "name": "Megumin!",
      "url": "https://jiktim.github.io/megumin/",
      "icon_url": "https://cdn.discordapp.com/avatars/255397678492418048/a8e516d198c913fb897aa592ce21e260.png"
    }
  }
};
param.channel.createMessage(data);
}