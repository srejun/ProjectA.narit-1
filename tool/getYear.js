var MongoClient = require('mongodb').MongoClient
var url = "mongodb://localhost:27017/"
exports.go = function (req, res) {
    var value = { confirm: false, err: '', data: null }

    if (req.body['location'] === undefined || req.body['inBuilding'] === undefined || req.body['year'] === undefined) {
        value.err = 'no filter'
        res.end(JSON.stringify(value))
    }
    else {
        MongoClient.connect(url, async function (err, db) {
            var dbo = db.db("DataSensor");
            var have_ses = await dbo.collection("Sessions").find({ session_id: req.sessionID }).toArray()
            if (have_ses.length <= 0) {
                value.err = 'permission denied'
                console.log(value)
                res.end(JSON.stringify(value))
            }
            else {
                var result = await dbo.collection(req.body['location']).find({ inBuilding: req.body['inBuilding'], date: { $gte: new Date(req.body['year'] + "-01-01 00:00:00").getTime(), $lt: new Date((parseInt(req.body['year']) + 1).toString() + "-01-01 00:00:00").getTime() } }).toArray()
                console.log(result.length)
                if (result.length <= 0) {
                    value.err = 'no data'
                    console.log(value)
                    res.end(JSON.stringify(value))
                }
                else {
                    var form = {
                        January: {
                            ave: {
                                humid: 0,
                                uv: 0,
                                tmp: 0,
                                wind: 0,
                                count: 0
                            }
                        },
                        Febuary: {
                            ave: {
                                humid: 0,
                                uv: 0,
                                tmp: 0,
                                wind: 0,
                                count: 0
                            }
                        },
                        March: {
                            ave: {
                                humid: 0,
                                uv: 0,
                                tmp: 0,
                                wind: 0,
                                count: 0
                            }
                        },
                        April: {
                            ave: {
                                humid: 0,
                                uv: 0,
                                tmp: 0,
                                wind: 0,
                                count: 0
                            }
                        },
                        June: {
                            ave: {
                                humid: 0,
                                uv: 0,
                                tmp: 0,
                                wind: 0,
                                count: 0
                            }
                        },
                        July: {
                            ave: {
                                humid: 0,
                                uv: 0,
                                tmp: 0,
                                wind: 0,
                                count: 0
                            }
                        },
                        August: {
                            ave: {
                                humid: 0,
                                uv: 0,
                                tmp: 0,
                                wind: 0,
                                count: 0
                            }
                        },
                        September: {
                            ave: {
                                humid: 0,
                                uv: 0,
                                tmp: 0,
                                wind: 0,
                                count: 0
                            }
                        },
                        October: {
                            ave: {
                                humid: 0,
                                uv: 0,
                                tmp: 0,
                                wind: 0,
                                count: 0
                            }
                        },
                        November: {
                            ave: {
                                humid: 0,
                                uv: 0,
                                tmp: 0,
                                wind: 0,
                                count: 0
                            }
                        },
                        December: {
                            ave: {
                                humid: 0,
                                uv: 0,
                                tmp: 0,
                                wind: 0,
                                count: 0
                            }
                        }


                    }
                    var response_data = {
                        humid: [],
                        uv: [],
                        tmp: [],
                        wind: [],
                        time: []
                    }
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].date >= new Date(req.body['year'] + ":January").getTime() && result[i].date < new Date(req.body['year'] + ":Febuary").getTime()) {
                            console.log("=>January")
                            form.January.ave.humid += result[i].ave[0].humidity
                            form.January.ave.uv += result[i].ave[0].uv
                            form.January.ave.wind += result[i].ave[0].wind
                            form.January.ave.tmp += result[i].ave[0].temperature
                            form.January.ave.count++
                        }
                        else if (result[i].date >= new Date(req.body['year'] + ":Febuary").getTime() && result[i].date < new Date(req.body['year'] + ":March").getTime()) {
                            console.log("=>Febuary")
                            form.Febuary.ave.humid += result[i].ave[0].humidity
                            form.Febuary.ave.uv += result[i].ave[0].uv
                            form.Febuary.ave.wind += result[i].ave[0].wind
                            form.Febuary.ave.tmp += result[i].ave[0].temperature
                            form.Febuary.ave.count++
                        }
                        else if (result[i].date >= new Date(req.body['year'] + ":March").getTime() && result[i].date < new Date(req.body['year'] + ":April").getTime()) {
                            console.log("=>:March")
                            form.March.ave.humid += result[i].ave[0].humidity
                            form.March.ave.uv += result[i].ave[0].uv
                            form.March.ave.wind += result[i].ave[0].wind
                            form.March.ave.tmp += result[i].ave[0].temperature
                            form.March.ave.count++
                        }
                        else if (result[i].date >= new Date(req.body['year'] + ":April").getTime() && result[i].date < new Date(req.body['year'] + ":June").getTime()) {
                            console.log("=>:April")
                            form.April.ave.humid += result[i].ave[0].humidity
                            form.April.ave.uv += result[i].ave[0].uv
                            form.April.ave.wind += result[i].ave[0].wind
                            form.April.ave.tmp += result[i].ave[0].temperature
                            form.April.ave.count++
                        }
                        else if (result[i].date >= new Date(req.body['year'] + ":June").getTime() && result[i].date < new Date(req.body['year'] + ":July").getTime()) {
                            console.log("=>:June")
                            form.June.ave.humid += result[i].ave[0].humidity
                            form.June.ave.uv += result[i].ave[0].uv
                            form.June.ave.wind += result[i].ave[0].wind
                            form.June.ave.tmp += result[i].ave[0].temperature
                            form.June.ave.count++
                        }
                        else if (result[i].date >= new Date(req.body['year'] + ":July").getTime() && result[i].date < new Date(req.body['year'] + ":August").getTime()) {
                            console.log("=>:July")
                            form.July.ave.humid += result[i].ave[0].humidity
                            form.July.ave.uv += result[i].ave[0].uv
                            form.July.ave.wind += result[i].ave[0].wind
                            form.July.ave.tmp += result[i].ave[0].temperature
                            form.July.ave.count++
                        }
                        else if (result[i].date >= new Date(req.body['year'] + ":August").getTime() && result[i].date < new Date(req.body['year'] + ":September").getTime()) {
                            console.log("=>:August")
                            form.August.ave.humid += result[i].ave[0].humidity
                            form.August.ave.uv += result[i].ave[0].uv
                            form.August.ave.wind += result[i].ave[0].wind
                            form.August.ave.tmp += result[i].ave[0].temperature
                            form.August.ave.count++
                        }
                        else if (result[i].date >= new Date(req.body['year'] + ":September").getTime() && result[i].date < new Date(req.body['year'] + ":October").getTime()) {
                            console.log("=>:September")
                            form.September.ave.humid += result[i].ave[0].humidity
                            form.September.ave.uv += result[i].ave[0].uv
                            form.September.ave.wind += result[i].ave[0].wind
                            form.September.ave.tmp += result[i].ave[0].temperature
                            form.September.ave.count++
                        }
                        else if (result[i].date >= new Date(req.body['year'] + ":October").getTime() && result[i].date < new Date(req.body['year'] + ":November").getTime()) {
                            console.log("=>:October")
                            form.October.ave.humid += result[i].ave[0].humidity
                            form.October.ave.uv += result[i].ave[0].uv
                            form.October.ave.wind += result[i].ave[0].wind
                            form.October.ave.tmp += result[i].ave[0].temperature
                            form.October.ave.count++
                        }
                        else if (result[i].date >= new Date(req.body['year'] + ":November").getTime() && result[i].date < new Date(req.body['year'] + ":December").getTime()) {
                            console.log("=>:November")
                            form.November.ave.humid += result[i].ave[0].humidity
                            form.November.ave.uv += result[i].ave[0].uv
                            form.November.ave.wind += result[i].ave[0].wind
                            form.November.ave.tmp += result[i].ave[0].temperature
                            form.November.ave.count++
                        }
                        else {
                            console.log("=>:December")
                            form.December.ave.humid += result[i].ave[0].humidity
                            form.December.ave.uv += result[i].ave[0].uv
                            form.December.ave.wind += result[i].ave[0].wind
                            form.December.ave.tmp += result[i].ave[0].temperature
                            form.December.ave.count++

                        }
                    }
                    function create_res(x) {
                        form[x].ave.humid = form[x].ave.humid / form[x].ave.count
                        form[x].ave.uv = form[x].ave.uv / form[x].ave.count
                        form[x].ave.wind = form[x].ave.wind / form[x].ave.count
                        form[x].ave.tmp = form[x].ave.tmp / form[x].ave.count
                        response_data.humid.push(form[x].ave.humid)
                        response_data.time.push(x)
                        response_data.uv.push(form[x].ave.uv)
                        response_data.wind.push(form[x].ave.wind)
                        response_data.tmp.push(form[x].ave.tmp)
                    }
                    for (var i = 0; i < Object.keys(form).length; i++) {
                        create_res(Object.keys(form)[i])
                    }
                    value['data'] = response_data
                    value['confirm'] = true
                    console.log(value)
                    res.end(JSON.stringify(value))

                }
            }
            db.close()
        });
    }
}
