var MongoClient = require('mongodb').MongoClient
var url = require("../config").url
exports.go = function (req, res) {
    var value = { confirm: false, err: '', data: null }

    if (req.body['location'] === undefined || req.body['inBuilding'] === undefined || req.body['Fyear'] === undefined || req.body['Tyear'] === undefined) {
        value.err = 'no filter'
        res.end(JSON.stringify(value))
    }
    else {
        MongoClient.connect(url, async function (err, db) {
            var dbo = db.db("DataSensor");
            //var have_ses = await dbo.collection("Sessions").find({ session_id: req.sessionID }).toArray()


            const findkey = await dbo.collection("location").find({ location: req.body['location'], status: true }).toArray()
            var result = await dbo.collection(findkey[0].key).find({ inBuilding: req.body['inBuilding'], date: { $gte: new Date(req.body['Fyear'] + "-01-01 00:00:00").getTime(), $lte: new Date(req.body['Tyear'] + "-12-31 23:59:59").getTime() } }).toArray()
            var data = {};
            var response_data = {
                humid: [],
                uv: [],
                tmp: [],
                wind: [],
                time: []
            }
            for (var i = req.body['Fyear']; i <= req['Tyear']; i++) {
                data[i] = {
                    1: {
                        ave: {
                            humid: 0,
                            uv: 0,
                            tmp: 0,
                            wind: 0,
                            count: 0,
                            time: null
                        }
                    },
                    2: {
                        ave: {
                            humid: 0,
                            uv: 0,
                            tmp: 0,
                            wind: 0,
                            count: 0,
                            time: null
                        }
                    },
                    3: {
                        ave: {
                            humid: 0,
                            uv: 0,
                            tmp: 0,
                            wind: 0,
                            count: 0,
                            time: null
                        }
                    },
                    4: {
                        ave: {
                            humid: 0,
                            uv: 0,
                            tmp: 0,
                            wind: 0,
                            count: 0,
                            time: null
                        }
                    },
                    5: {
                        ave: {
                            humid: 0,
                            uv: 0,
                            tmp: 0,
                            wind: 0,
                            count: 0,
                            time: null
                        }
                    },
                    6: {
                        ave: {
                            humid: 0,
                            uv: 0,
                            tmp: 0,
                            wind: 0,
                            count: 0,
                            time: null
                        }
                    },
                    7: {
                        ave: {
                            humid: 0,
                            uv: 0,
                            tmp: 0,
                            wind: 0,
                            count: 0,
                            time: null
                        }
                    },
                    8: {
                        ave: {
                            humid: 0,
                            uv: 0,
                            tmp: 0,
                            wind: 0,
                            count: 0,
                            time: null
                        }
                    },
                    9: {
                        ave: {
                            humid: 0,
                            uv: 0,
                            tmp: 0,
                            wind: 0,
                            count: 0,
                            time: null
                        }
                    },
                    10: {
                        ave: {
                            humid: 0,
                            uv: 0,
                            tmp: 0,
                            wind: 0,
                            count: 0,
                            time: null
                        }
                    },
                    11: {
                        ave: {
                            humid: 0,
                            uv: 0,
                            tmp: 0,
                            wind: 0,
                            count: 0,
                            time: null
                        }
                    },
                    12: {
                        ave: {
                            humid: 0,
                            uv: 0,
                            tmp: 0,
                            wind: 0,
                            count: 0,
                            time: null
                        }


                    }
                }
            }
            console.log("xdata i s"+JSON.stringify(data))
            
            for (var i = 0; i < result.length; i++) {
                data[new Date(result[i].date).getFullYear()][new Date(result[i].date).getMonth() + 1].humid += result[i].ave[0].humidity
                data[new Date(result[i].date).getFullYear()][new Date(result[i].date).getMonth() + 1].uv += result[i].ave[0].uv
                data[new Date(result[i].date).getFullYear()][new Date(result[i].date).getMonth() + 1].wind += result[i].ave[0].wind
                data[new Date(result[i].date).getFullYear()][new Date(result[i].date).getMonth() + 1].tmp += result[i].ave[0].temperature
                data[new Date(result[i].date).getFullYear()][new Date(result[i].date).getMonth() + 1].count++
                data[new Date(result[i].date).getFullYear()][new Date(result[i].date).getMonth() + 1].time = new Date(result[i].date).getFullYear( + "/" + new Date(result[i].date).getMonth())
                 if (i%50==0){console.log("data is"+50*i)}
            }
            console.log("pass data")
            function create_res(x) {
            
                for(var j =1;j<=12;j++)
                {
                  
                    data[x][j].ave.humid += data[x][j].ave.humid/data[x][j].ave.count
                    data[x][j].ave.uv +=   data[x][j].ave.uv/data[x][j].ave.count
                    data[x][j].ave.wind += data[x][j].ave.wind/data[x][j].ave.count
                    data[x][j].ave.tmp += data[x][j].ave.tmp/data[x][j].ave.count

                    response_data.humid.push(data[x][j].ave.humid)
                    response_data.time.push(data[x][j].ave.time)
                    response_data.uv.push(data[x][j].ave.uv)
                    response_data.wind.push(data[x][j].ave.wind)
                    response_data.tmp.push(data[x][j].ave.tmp)
                }
                console.log("data"+x+"is"+ data[x])
            }
            for(var i = req.body['Fyear']; i <= req['Tyear']; i++)
            {
                create_res(i)
            }

            res.end(JSON.stringify( response_data))






            db.close()
        });
    }
}
