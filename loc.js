var mongoose = require('mongoose');
var _ = require('lodash');
var properties = require ('properties');
var ip_db = process.env.OPENSHIFT_MONGODB_DB_HOST || "localhost";
var port_db = process.env.OPENSHIFT_MONGODB_DB_PORT || 27017;

console.log(__dirname);
var auth_options = {};

properties.parse ("db_cred.properties", { path: true }, function (error, obj){
    console.log(obj);
    if (error) return console.error (error);
        auth_options = {
        user: obj.user,
        pass: obj.pass,
        auth: {authdb:'admin'}
    };
});

console.log(auth_options);

if (ip_db === 'localhost') auth_options = {};

mongoose.connect('mongodb://' + ip_db + ':' + port_db + '/nodeapp', auth_options);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
    console.log('connected to DB...');
});

var express = require('express');
var app = express();
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

app.use(morgan('dev')); 					// log every request to the console
app.use(bodyParser()); 						// pull information from html in POST
app.use(methodOverride());

app.use(express.static(__dirname + '/public'));

var locationsSchema = mongoose.Schema({
    name: String,
    lat: String,
    lng: String,
    city: String,
    country: String,
    date_modified: Date,
    formatted_address: String,
    website: String,
    international_phone_number: String,
    zoom: String,
    description: String
});

var Location = mongoose.model('Location', locationsSchema);

//app.param('id', Location);

app.route('/api/locations')
    .get(function(req, res, next){
        return Location.find(function(err, locations) {
            if (!err) {
                return res.json(locations);
            } else {
                return console.log(err);
            }
        });
    })
    .post(function(req, res, next) {
        var location;
        console.log(req.body);
        location = new Location(req.body);
        location.save(function (err, location) {
            if (!err) {
                console.log("created");
                return res.json(location);
            } else {
                return console.log(err);
            }
        });
    });

app.route('/api/locations/:id')
    .get(function(req, res, next) {
        return Location.findById(req.params.id, function (err, location) {
            if (!err && location) {
                return res.json(location);
            } else {
                console.log(err === null ? 'some error, possibly can\'t find such id' : err );
                return res.send(500, "Can't find such id");
            }
        });
    })
    .put(function(req, res, next) {
        return Location.findById(req.params.id, function (err, location) {
            if (!err && location) {
                var newLocation = _.extend(location, req.body);
                var d = new Date();
                var tzo = (d.getTimezoneOffset()/60)*(-1);
                d.setHours(d.getHours() + tzo);
                newLocation = _.extend(newLocation, { 'date_modified': d });
                return newLocation.save(function (err, location) {
                    if (!err) {
                        console.log("updated");
                        return res.json(location);
                    } else {
                        return console.log(err);
                    }
                });
            } else {
                console.log(err === null ? 'some error, possibly can\'t find such id' : err );
                return res.send(500, "Can't find such id");
            }
        });
    })
    .delete(function(req, res, next) {
        return Location.findById(req.params.id, function (err, location) {
            if (!err && location) {
                return location.remove(function (err) {
                    if (!err) {
                        console.log("removed");
                        return res.send('removed');
                    } else return console.log(err);
                })
            } else {
                console.log(err === null ? 'some error, possibly can\'t find such id' : err );
                return res.send(500, "Can't find such id");
            }
        });
    });


// Start the server.
var port = process.env.OPENSHIFT_NODEJS_PORT || 4242;
var ip = process.env.OPENSHIFT_NODEJS_IP || "localhost";
app.listen(port, ip);
console.log('Listening on some port...');