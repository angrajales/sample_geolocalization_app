module.exports = {
    "dev": {
        "url": "mongodb://localhost:27017/geolocalization_db" 
    },
    "test": {
        "url": "mongodb://mongo-server/geolocalization_db"
    },
    "prod" : {
        "url": "mongodb+srv://admin:jah-admin@geolocalizationappmongodb-y9rwv.gcp.mongodb.net/test?retryWrites=true&w=majority"
    }
}