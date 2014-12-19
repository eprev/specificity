var profiles;

$.ajax({
    url: '/data',
    async: false,
    dataType: 'json',
    success: function (json) {
        profiles = json;
    }
});

console.log(profiles);

$(function () {
    var options = profiles.length > 1 ? '<option value="">*</option>' : '';
    profiles.forEach(function (profile, index) {
        options += '<option value="' + index + '">' + (profile.json.options.label || profile.file) + '</option>';
    });
    $('#profiles').html(options).change();
});

$('#profiles').change(function () {
    var profileId = $(this).val();
    loadProfile(profileId);
});

function loadProfile(profileId) {
    if (profileId !== '') {
        var profile = profiles[profileId],
            files = profile.json.files;
        updateProfileDistribution(files);
        updateProfileSelectors(files);
        updateProfileImportant(files);
        updateProfileSpecificity(files);
        updateProfileMedian(files);
    } else {
    }
}

function updateProfileDistribution(files) {
    var columns = [];
    var labels = ['x'];

    var max = [0, 0, 0];
    var data = files['*'];
    if (data.weight_a.max > max[0]) {
        max[0] = data.weight_a.max;
    }
    if (data.weight_b.max > max[1]) {
        max[1] = data.weight_b.max;
    }
    if (data.weight_c.max > max[2]) {
        max[2] = data.weight_c.max;
    }

    var keys = Object.keys(files);
    keys.forEach(function (name) {
        columns.push([name]);
    });

    var w = [0, 0, 0];
    for (;;) {
        var sw = w.join(',');
        var empty = true;
        keys.forEach(function (name) {
            if (files[name].distrib[sw]) {
                empty = false;
            }
        });
        if (!empty) {
            keys.forEach(function (name, i) {
                columns[i].push( files[name].distrib[sw] || 0 );
            });
            labels.push(sw);
        }
        w[2]++;
        if (w[2] > max[2]) {
            w[2] = 0;
            w[1]++;
            if (w[1] > max[1]) {
                w[1] = 0;
                w[0]++;
                if (w[0] > max[0]) break;
            }
        }
    }
    columns.push(labels);
    c3.generate({
        bindto: '#chart-distribution',
        padding: {
            top: 10
        },
        data: {
            x: 'x',
            columns: columns,
            type: 'bar'
        },
        axis: {
            x: {
                type: 'category',
                tick: {
                    culling: {
                        max: 30
                    },
                    rotate: -60,
                    multiline: false
                },
                height: 50
            }
        },
        subchart: {
            show: true
        },
        zoom: {
            enabled: true,
            rescale: true
        }
    });
}

function updateProfileSelectors(files) {
    var columns = [];
    // var columns2 = [];
    var selectors = {};
    var labels = ['x'];
    // var labels2 = ['x'];

    var keys = Object.keys(files);

    keys.forEach(function(name) {
        // if (name !== '*') {
        //     columns2.push([name, files[name].series.length]);
        //     labels2.push(name);
        // }
        columns.push([name, files[name].series.length]);
        labels.push(name);
    });

    columns.push(labels);
    // columns2.push(labels2);
    c3.generate({
        bindto: '#chart-selectors',
        padding: {
            top: 10
        },
        data: {
            x: 'x',
            columns: columns,
            type: 'bar'
        },
        axis: {
            x: {
                type: 'category',
                tick: {
                    culling: {
                        max: 30
                    },
                    rotate: -60,
                    multiline: false
                },
                height: 50
            }
        }
    });
    // c3.generate({
    //     bindto: '#chart-selectors-2',
    //     padding: {
    //         top: 10
    //     },
    //     data: {
    //         x: 'x',
    //         columns: columns2,
    //         type: 'pie'
    //     },
    //     axis: {
    //         x: {
    //             type: 'category',
    //             tick: {
    //                 culling: {
    //                     max: 30
    //                 },
    //                 rotate: -60,
    //                 multiline: false
    //             },
    //             height: 50
    //         }
    //     }
    // });
}

function updateProfileImportant(files) {
    var columns = [];
    var labels = ['x'];

    var keys = Object.keys(files);

    keys.forEach(function (name) {
        columns.push([name, files[name].important.avg]);
        labels.push(name);
    });

    columns.push(labels);
    c3.generate({
        bindto: '#chart-important',
        padding: {
            top: 10
        },
        data: {
            x: 'x',
            columns: columns,
            type: 'bar'
        },
        axis: {
            x: {
                type: 'category',
                tick: {
                    culling: {
                        max: 30
                    },
                    rotate: -60,
                    multiline: false
                },
                height: 50
            }
        }
    });
}

function updateProfileSpecificity(files) {
    var columns = [];
    var labels = ['x'];

    var keys = Object.keys(files);

    keys.forEach(function (name) {
        var weight = files[name].weight.avg;
        columns.push([name, weight[0] * 100 + weight[1] * 10 + weight[2]]);
        labels.push(name);
    });
    columns.push(labels);
    c3.generate({
        bindto: '#chart-average',
        padding: {
            top: 10
        },
        data: {
            x: 'x',
            columns: columns,
            type: 'bar'
        },
        axis: {
            x: {
                type: 'category',
                tick: {
                    culling: {
                        max: 30
                    },
                    rotate: -60,
                    multiline: false
                },
                height: 50
            }
        }
    });
}

function updateProfileMedian (files) {
    var columns = [];
    var labels = ['x'];
    var keys = Object.keys(files);

    keys.forEach(function (name) {
        var weight = files[name].weight.med;
        columns.push([name, weight[0] * 100 + weight[1] * 10 + weight[2]]);
        labels.push(name);
    });

    columns.push(labels);
    c3.generate({
        bindto: '#chart-median',
        padding: {
            top: 10
        },
        data: {
            x: 'x',
            columns: columns,
            type: 'bar'
        },
        axis: {
            x: {
                type: 'category',
                tick: {
                    culling: {
                        max: 30
                    },
                    rotate: -60,
                    multiline: false
                },
                height: 50
            }
        }
    });
}

