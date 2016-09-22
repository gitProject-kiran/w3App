/**
 * Created by M036 on 9/1/2016.
 */
var citVeif = false;
var indexValue = 0;
function loadData($http, $q) {

    var oauthSignature = require('oauth-signature');

    function randomString(length, chars) {
        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
        return result;
    }

    /*take all city for verifiying the yelp data*/
    function cityVerification(inputCity) {
        var city = [
            'Buenos Aires', 'Adelaide', 'Brisbane', 'Melbourne', 'Perth', 'Sydney', 'Wien', 'Antwerpen',
            'Bruxelles', 'Rio de Janeiro', 'São Paulo', 'Calgary', 'Edmonton', 'Halifax', 'Montréal',
            'Ottawa', 'Toronto', 'Vancouver', 'Santiago', 'Praha', 'København', 'Helsinki', 'Lyon',
            'Marseille', 'Paris', 'Berlin', 'Frankfurt am Main', 'Hamburg', 'Köln',
            'München', 'Milano', 'Roma', 'Kuala Lumpur', 'México D.F', 'Auckland', 'NORWAY', 'Oslo',
            'Manila', 'POLAND', 'Kraków', 'Warszawa', 'Lisboa', 'Dublin', 'Singapore', 'Barcelona',
            'Madrid', 'Stockholm', 'Zürich', 'Amsterdam', 'Istanbul', 'Belfast', 'Brighton',
            'Bristol', 'Cardiff', 'Edinburgh', 'Glasgow', 'Leeds', 'Liverpool', 'London', 'Manchester', 'AZ',
            'Phoenix', 'Scottsdale', 'Tempe', 'Tucson', 'CA', 'Alameda', 'Albany', 'Alhambra', 'Anaheim', 'Belmont',
            'Berkeley', 'Beverly Hills', 'Big Sur', 'Burbank', 'Concord', 'Costa Mesa', 'Culver City', 'Cupertino',
            'Daly City', 'Davis', 'Dublin', 'Emeryville', 'Foster City', 'Fremont', 'Glendale', 'Hayward', 'Healdsburg',
            'Huntington Beach', 'Newport Beach',
            'Irvine', 'La Jolla', 'Livermore', 'Long Beach', 'Los Altos', 'Los Angeles', 'Los Gatos', 'Marina del Rey',
            'Menlo Park', 'Mill Valley', 'Millbrae', 'Milpitas', 'Monterey', 'Mountain View', 'Napa', 'Newark',
            'Oakland', 'Orange County', 'Palo Alto', 'Park La Brea', 'Pasadena', 'Pleasanton', 'Redondo Beach',
            'Redwood City', 'Sacramento', 'San Bruno', 'San Carlos', 'San Diego', 'San Francisco', 'San Jose',
            'San Leandro', 'San Mateo', 'San Rafael', 'Santa Barbara', 'Santa Clara', 'Santa Cruz', 'Santa Monica',
            'Santa Rosa', 'Sausalito', 'Sonoma', 'South Lake Tahoe', 'Stockton', 'Studio City', 'Sunnyvale', 'Torrance',
            'Union City', 'Venice', 'Walnut Creek', 'West Hollywood', 'West Los Angeles', 'Westwood',
            'Yountville', 'Boulder', 'Denver', 'Hartford', 'New Haven', 'Washington', 'Fort Lauderdale', 'Gainesville',
            'Miami', 'Miami Beach', 'Orlando', 'Tampa', 'Atlanta', 'Savannah', 'Honolulu', 'Lahaina', 'Iowa City',
            'Boise', 'Chicago', 'Evanston', 'Naperville', 'Schaumburg', 'Skokie', 'Bloomington', 'Indianapolis',
            'Louisville', 'New Orleans', 'Allston', 'Boston', 'Brighton', 'Brookline', 'Cambridge', 'Somerville',
            'Baltimore', 'Ann Arbor', 'Detroit', 'Minneapolis', 'Saint Paul', 'Kansas City', 'Saint Louis', 'Charlotte',
            'Durham', 'Raleigh', 'Newark', 'Princeton', 'Albuquerque', 'Santa Fe', 'Las Vegas', 'Reno', 'Brooklyn',
            'Long Island', 'New York', 'Flushing', 'Cincinnati', 'Cleveland', 'Columbus', 'Portland', 'Salem',
            'Philadelphia', 'Pittsburgh', 'Providence', 'Charleston', 'Memphis', 'Nashville', 'Austin', 'Dallas',
            'Houston', 'San Antonio', 'Salt Lake Ci', 'Alexandria', 'Arlington', 'Richmond', 'Burlington', 'Bellevue',
            'Redmond', 'Seattle', 'Madison', 'Milwaukee'
        ];

        var defered = $q.defer();
        var cityInUpperCaseFormat = inputCity.toUpperCase();
        var cityWithSingleSpaceString = cityInUpperCaseFormat.replace(/\s+/g, ' ');

        for (var i = 0; i < city.length; i++) {
            city[i] = city[i].toUpperCase();
            if (city[i] == cityWithSingleSpaceString) {
                citVeif = true;
                defered.resolve(city[i]);
                break;
            }
        }
        return defered.promise;
    }

    return {
        'retrieveYelp': function (input, term) {
            cityVerification(input);
            if (citVeif) {
                citVeif = !citVeif;
                var defered = $q.defer(),
                    method = 'GET',
                    url = 'http://api.yelp.com/v2/search',
                    location = input,
                    params = {
                        callback: 'angular.callbacks._' + indexValue.toString(),
                        location: location,
                        oauth_consumer_key: 'hyIQVkkGLREDsZobyPp5dQ', //Consumer Key
                        oauth_token: 'PCPmAjNSEpcZ4T7TFaQ3VKj8-nhhRhWJ', //Token
                        oauth_signature_method: 'HMAC-SHA1',
                        oauth_timestamp: new Date().getTime(),
                        oauth_nonce: randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'),
                        term: term
                    };

                ++indexValue;

                var consumerSecret = 'UgKdpO46BHlEOT-3K3MIPilF-Ro', //Consumer Secret
                    tokenSecret = 'uF-cSlKj9usvzCIjSeVzwR2OcS8', //Token Secret
                    signature = oauthSignature.generate(method, url, params,
                        consumerSecret, tokenSecret, {encodeSignature: false});
                params.oauth_signature = signature;

                $http.jsonp(url, {params: params})
                    .success(function (data) {
                        defered.resolve(data);
                    })
                    .error(function () {
                        defered.resolve([]);
                        console.log('Error Promise getQuote user.js');
                    });
                return defered.promise;
            } else {
                return 0;
            }
        },
        'retrieveFourSquare': function (input, term) {
            var defered = $q.defer();
            var location = input;
            var clientID = 'GR1ME1PHB4ECI4WOIIZDL0XHSOHII0AA1JSZIZ0GMTPNQXG2';
            var clientSecret = '3QHVLLXFDMD5VZEYXHBANTDG4KNA25BXNHY4XNZDRK1MNI2P';

            /*call to google api to get longitude and latidude*/
            $http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + location +
                '&key=AIzaSyB7ptHzW6ivZb_SAzXsF3PTOB0udygejzo').success(function (dataFourSquare) {

                /*verify longitude and latitude generated or not*/
                if (dataFourSquare.results.length !== 0) {

                    var lat = dataFourSquare.results[0].geometry.location.lat;
                    var lng = dataFourSquare.results[0].geometry.location.lng;

                    $http.get('https://api.foursquare.com/v2/venues/explore?ll=' + lat + ',' + lng +
                        '&venuePhotos=1&section=' + term +
                        '&client_id=' + clientID + '&client_secret=' + clientSecret + ' &v=20131124'
                    ).success(function (result) {

                        var items = result.response.groups[0].items;
                        var help = [];

                        for (var i = 0; i < items.length; i++) {
                            var place = items[i].venue;
                            help.push(place);
                        }
                        defered.resolve(help);
                    }).error(function (data, status) {
                        defered.resolve(status);
                    });
                } else {
                    defered.resolve(-1);
                }
            });
            return defered.promise;
        }
    };
}
module.exports = /*@ngInject*/ loadData;