
function markerOnClickPieChart(e) {
    $.getJSON("data/income.json", function (json) {
        var updateObject=$.grep(json, function (item) {
            return item.Area == e;
        });
        var first = updateObject[0];

        var offsetWidth = document.getElementById('chart').offsetWidth;

        var pie = new d3pie("pieChart", {
            "header": {
                "title": {
                    "text": "Income Distribution in 2012 ",
                    "fontSize": 30,
                    "font": "Roboto"
                },
                "subtitle": {
                    "text": "This chart shows the income in this area as % of overall population of the area",
                    "color": "#999999",
                    "fontSize": 10,
                    "font": "Roboto"
                },
                "titleSubtitlePadding": 2
            },
            "footer": {
              "text": "Source: DELPHI",
              "color": "#999999",
              "fontSize": 11,
              "font": "open sans",
              "location": "bottom-center"
            },
            "size": {
              "canvasWidth": offsetWidth,
              "pieOuterRadius": "88%"
            },
            "data": {
                "sortOrder": "label-desc",
                "content": [
                    {
                        "label": "<$15K",
                        "value": first["Households with income <$15K"],
                        "color": "#2383c1"
                    },
                    {
                        "label": "Households with income $15k-$35k",
                        "value": first["Households with income $15k-$35k"],
                        "color": "#64a61f"
                    },
                    {
                        "label": "Households with income$35k-$50k",
                        "value": first["Households with income$35k-$50k"],
                        "color": "#7b6788"
                    },
                    {
                        "label": "Households with income $50k-$75k",
                        "value": first["Households with income $50k-$75k"],
                        "color": "#a05c56"
                    },
                    {
                        "label": "Households with income $75k-$100k",
                        "value": first["Households with income $75k-$100k"],
                        "color": "#961919"
                    },
                    {
                        "label": "Households with income $100k-$150k",
                        "value": first["Households with income $100k-$150k"],
                        "color": "#a7b36d"
                    },
                    {
                        "label": "Households with income $150k-$200k",
                        "value": first["Households with income $150k-$200k"],
                        "color": "#e98125"
                    },
                    {
                        "label": "Households with income >$200k",
                        "value": first["Households with income >$200k"],
                        "color": "#e98125"
                    }
                ]
            },
            "labels": {
              "outer": {
                "pieDistance": 32
              },
              "mainLabel": {
                "color": "#000000",
                "font": "verdana"
              },
              "percentage": {
                "color": "#e1e1e1",
                "font": "verdana",
                "decimalPlaces": 0
              },
              "value": {
                "color": "#e1e1e1",
                "font": "verdana"
              },
              "lines": {
                "enabled": true,
                "color": "#cccccc"
              },
              "truncation": {
                "enabled": true
              }
            },
            "tooltips": {
              "enabled": true,
              "type": "placeholder",
              "string": "{value} households"
            },
            "effects": {
              "pullOutSegmentOnClick": {
                "effect": "linear",
                "speed": 400,
                "size": 8
              }
            },
            "callbacks": {}
        });
    });
}
