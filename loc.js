var mongoose = require('mongoose');
var _ = require('lodash');
var properties = require ('properties');
var ip_db = process.env.OPENSHIFT_MONGODB_DB_HOST || "localhost";
var port_db = process.env.OPENSHIFT_MONGODB_DB_PORT || 27017;

var db_file = ip_db === 'localhost' ? "db_cred.properties" : "../../data/db_pr/db_cred.properties";

properties.parse (db_file, { path: true }, function (error, obj){
    if (error) return console.error (error);
    var auth_options = {
        user: obj.user,
        pass: obj.pass,
        auth: {authdb:'admin'}
    };
    if (ip_db === 'localhost') auth_options = {};
    mongoose.connect('mongodb://' + ip_db + ':' + port_db + '/nodeapp', auth_options);
});

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
        location = new Location(req.body);
        var newLocation = _.extend(location, { 'date_modified': getDateTzo() });
        newLocation.save(function (err, location) {
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

                newLocation = _.extend(newLocation, { 'date_modified': getDateTzo() });
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

function getDateTzo() {
    var d = new Date();
    var tzo = (d.getTimezoneOffset()/60)*(-1);
    d.setHours(d.getHours() + tzo);
    return d;
}

// Start the server.
var port = process.env.OPENSHIFT_NODEJS_PORT || 4242;
var ip = process.env.OPENSHIFT_NODEJS_IP || "localhost";
app.listen(port, ip);
console.log('Listening on some port...');