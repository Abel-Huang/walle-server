/**
 * Created by huangjianjin on 2016/12/24.
 */
var mongoose = require('mongoose');

exports.insertMogo=function () {
    mongoose.connect('mongodb://localhost/location');
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        console.log('mongoose opened!');
        var userSchema = new mongoose.Schema({
                name:{type: String, unique: true},
                password:String
            },
            {collection: "location"}
        );
        var User = mongoose.model('location', userSchema);

        User.findOne({name:"WangEr"}, function(err, doc){
            if(err)
                console.log(err);
            else
                console.log(doc.name + ", password - " + doc.password);
        });

        var lisi = new User({name:"WangEr", password:"654321"});
        lisi.save(function(err, doc){
            if(err)console.log(err);
            else console.log(doc.name + ' saved');
        });
    });
}