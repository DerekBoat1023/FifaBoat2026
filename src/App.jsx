import { useState, useMemo, useCallback } from "react";
import Papa from "papaparse";
import { SpeedInsights } from '@vercel/speed-insights/react';

// ============================================================
// FIFA 2026 SALES HUB v2 — Full Market Intelligence Dashboard
// Data snapshot: 3/10/2026
// ============================================================

// ---------- 104-MATCH DATABASE (3/10 latest discovery prices) ----------
const RAW_EVENTS = [
{id:1,name:"Mexico vs South Africa",group:"A",venue:"Estadio Azteca",capacity:98500,location:"Ciudad de Mexico",date:"6/11",day:"Thu",time:"2:00PM",pMin:2435.40,p25:4265.50,p50:6480.00,ticketQty:3235,listingQty:514,visits7d:45720,trans7d:11,pos:"https://reachpro.com/inventory/event?eventId=153033405",gotickets:"https://pro.gotickets.com/tickets/541371/2026-fifa-world-cup-match-1-group-a-mexico-vs-tbd-tickets/estadio-azteca-ciudad-de-m-xico-cdmx-6-11-2026"},
{id:2,name:"Korea Republic vs TBD",group:"A",venue:"Estadio Akron",capacity:49800,location:"Zapopan, Mexico",date:"6/11",day:"Thu",time:"9:00PM",pMin:335.59,p25:598.53,p50:1020.15,ticketQty:2042,listingQty:395,visits7d:38068,trans7d:11,pos:"https://reachpro.com/inventory/event?eventId=153033402",gotickets:"https://pro.gotickets.com/tickets/544920/2026-fifa-world-cup-match-2-group-a-tickets/akron-stadium-mexico-zapopan-jal-6-11-2026"},
{id:3,name:"Canada vs TBD",group:"B",venue:"BMO Field",capacity:30000,location:"Toronto, Canada",date:"6/12",day:"Fri",time:"",pMin:1291.66,p25:1962.36,p50:2812.55,ticketQty:2122,listingQty:446,visits7d:58155,trans7d:14,pos:"https://reachpro.com/inventory/event?eventId=153021783",gotickets:"https://pro.gotickets.com/tickets/541362/2026-fifa-world-cup-match-3-group-b-canada-vs-tbd-tickets/bmo-field-toronto-on-6-12-2026"},
{id:4,name:"USA vs Paraguay",group:"D",venue:"SoFi Stadium",capacity:70240,location:"Inglewood, CA",date:"6/12",day:"Fri",time:"",pMin:1140.00,p25:2012.15,p50:2900.71,ticketQty:3310,listingQty:793,visits7d:69258,trans7d:28,pos:"https://reachpro.com/inventory/event?eventId=153020709",gotickets:"https://pro.gotickets.com/tickets/541539/2026-fifa-world-cup-match-4-group-d-usa-vs-tbd-tickets/sofi-stadium-inglewood-ca-6-12-2026"},
{id:5,name:"Haiti vs Scotland",group:"C",venue:"Gillette Stadium",capacity:68756,location:"Foxborough, MA",date:"6/13",day:"Sat",time:"",pMin:558.23,p25:810.00,p50:1206.49,ticketQty:3188,listingQty:743,visits7d:53264,trans7d:14,pos:"https://reachpro.com/inventory/event?eventId=153021802",gotickets:"https://pro.gotickets.com/tickets/541418/2026-fifa-world-cup-match-5-group-c-tickets/gillette-stadium-foxborough-ma-6-13-2026"},
{id:6,name:"Australia vs TBD",group:"D",venue:"BC Place Stadium",capacity:54500,location:"Vancouver, Canada",date:"6/13",day:"Sat",time:"",pMin:361.56,p25:565.05,p50:1117.80,ticketQty:2410,listingQty:514,visits7d:53843,trans7d:14,pos:"https://reachpro.com/inventory/event?eventId=153020454",gotickets:"https://pro.gotickets.com/tickets/541347/2026-fifa-world-cup-match-6-group-d-tickets/bc-place-stadium-vancouver-bc-6-13-2026"},
{id:7,name:"Brazil vs Morocco",group:"C",venue:"MetLife Stadium",capacity:82500,location:"East Rutherford, NJ",date:"6/13",day:"Sat",time:"",pMin:849.07,p25:1556.23,p50:2340.86,ticketQty:4597,listingQty:940,visits7d:77419,trans7d:53,pos:"https://reachpro.com/inventory/event?eventId=153021803",gotickets:"https://pro.gotickets.com/tickets/541515/2026-fifa-world-cup-match-7-group-c-tickets/metlife-stadium-east-rutherford-nj-6-13-2026"},
{id:8,name:"Qatar vs Switzerland",group:"B",venue:"Levi's Stadium",capacity:75000,location:"Santa Clara, CA",date:"6/13",day:"Sat",time:"",pMin:284.69,p25:505.00,p50:799.00,ticketQty:3301,listingQty:763,visits7d:56778,trans7d:57,pos:"https://reachpro.com/inventory/event?eventId=153020611",gotickets:"https://pro.gotickets.com/tickets/541443/2026-fifa-world-cup-match-8-group-b-tickets/levi-s-stadium-santa-clara-ca-6-13-2026"},
{id:9,name:"Cote d'Ivoire vs Ecuador",group:"E",venue:"Lincoln Financial Field",capacity:69176,location:"Philadelphia, PA",date:"6/14",day:"Sun",time:"",pMin:442.33,p25:740.91,p50:1002.46,ticketQty:3039,listingQty:690,visits7d:56600,trans7d:39,pos:"https://reachpro.com/inventory/event?eventId=153022356",gotickets:"https://pro.gotickets.com/tickets/541468/2026-fifa-world-cup-match-9-group-e-tickets/lincoln-financial-field-philadelphia-pa-6-14-2026"},
{id:10,name:"Germany vs Curacao",group:"E",venue:"NRG Stadium",capacity:71500,location:"Houston, TX",date:"6/14",day:"Sun",time:"12:00PM",pMin:360.97,p25:639.16,p50:957.08,ticketQty:3565,listingQty:814,visits7d:50437,trans7d:41,pos:"https://reachpro.com/inventory/event?eventId=153020800",gotickets:"https://pro.gotickets.com/tickets/541530/2026-fifa-world-cup-match-10-group-e-tickets/nrg-stadium-houston-tx-6-14-2026"},
{id:11,name:"Netherlands vs Japan",group:"F",venue:"AT&T Stadium",capacity:80000,location:"Arlington, TX",date:"6/14",day:"Sun",time:"3:00PM",pMin:570.31,p25:945.59,p50:1369.06,ticketQty:2637,listingQty:582,visits7d:58924,trans7d:47,pos:"https://reachpro.com/inventory/event?eventId=153021218",gotickets:"https://pro.gotickets.com/tickets/541317/2026-fifa-world-cup-match-11-group-f-tickets/at-t-stadium-arlington-tx-6-14-2026"},
{id:12,name:"TBA vs Tunisia",group:"F",venue:"Estadio BBVA Bancomer",capacity:52237,location:"Monterrey, Mexico",date:"6/14",day:"Sun",time:"9:00PM",pMin:189.00,p25:352.07,p50:686.83,ticketQty:2158,listingQty:420,visits7d:52149,trans7d:13,pos:"https://reachpro.com/inventory/event?eventId=153033421",gotickets:"https://pro.gotickets.com/tickets/541384/2026-fifa-world-cup-match-12-group-f-tickets/estadio-bbva-guadalupe-n-l-6-14-2026"},
{id:13,name:"Saudi Arabia vs Uruguay",group:"H",venue:"Hard Rock Stadium",capacity:76100,location:"Miami Gardens, FL",date:"6/15",day:"Mon",time:"",pMin:309.66,p25:500.00,p50:735.00,ticketQty:3845,listingQty:884,visits7d:53882,trans7d:40,pos:"https://reachpro.com/inventory/event?eventId=153022572",gotickets:"https://pro.gotickets.com/tickets/541433/2026-fifa-world-cup-match-13-group-h-tickets/hard-rock-stadium-miami-gardens-fl-6-15-2026"},
{id:14,name:"Spain vs Cabo Verde",group:"H",venue:"Mercedes-Benz Stadium",capacity:71000,location:"Atlanta, GA",date:"6/15",day:"Mon",time:"",pMin:357.90,p25:603.96,p50:900.00,ticketQty:3660,listingQty:834,visits7d:52736,trans7d:45,pos:"https://reachpro.com/inventory/event?eventId=153022393",gotickets:"https://pro.gotickets.com/tickets/541504/2026-fifa-world-cup-match-14-group-h-tickets/mercedes-benz-stadium-atlanta-ga-6-15-2026"},
{id:15,name:"Iran vs New Zealand",group:"G",venue:"SoFi Stadium",capacity:70240,location:"Inglewood, CA",date:"6/15",day:"Mon",time:"",pMin:263.12,p25:530.00,p50:880.00,ticketQty:4160,listingQty:989,visits7d:53420,trans7d:21,pos:"https://reachpro.com/inventory/event?eventId=153020712",gotickets:"https://pro.gotickets.com/tickets/541540/2026-fifa-world-cup-match-15-group-g-tickets/sofi-stadium-inglewood-ca-6-15-2026"},
{id:16,name:"Belgium vs Egypt",group:"G",venue:"Lumen Field",capacity:67000,location:"Seattle, WA",date:"6/15",day:"Mon",time:"",pMin:360.46,p25:640.64,p50:950.00,ticketQty:2948,listingQty:673,visits7d:60857,trans7d:33,pos:"https://reachpro.com/inventory/event?eventId=153020522",gotickets:"https://pro.gotickets.com/tickets/541486/2026-fifa-world-cup-match-16-group-g-tickets/lumen-field-seattle-wa-6-15-2026"},
{id:17,name:"France vs Senegal",group:"I",venue:"MetLife Stadium",capacity:82500,location:"East Rutherford, NJ",date:"6/16",day:"Tue",time:"",pMin:517.50,p25:944.40,p50:1369.80,ticketQty:3660,listingQty:813,visits7d:63219,trans7d:46,pos:"https://reachpro.com/inventory/event?eventId=153022598",gotickets:"https://pro.gotickets.com/tickets/541516/2026-fifa-world-cup-match-17-group-i-tickets/metlife-stadium-east-rutherford-nj-6-16-2026"},
{id:18,name:"TBD vs Norway",group:"I",venue:"Gillette Stadium",capacity:68756,location:"Foxborough, MA",date:"6/16",day:"Tue",time:"",pMin:396.00,p25:660.00,p50:1040.00,ticketQty:3111,listingQty:662,visits7d:58362,trans7d:18,pos:"https://reachpro.com/inventory/event?eventId=153022585",gotickets:"https://pro.gotickets.com/tickets/541419/2026-fifa-world-cup-match-18-group-i-tickets/gillette-stadium-foxborough-ma-6-16-2026"},
{id:19,name:"Argentina vs Algeria",group:"J",venue:"GEHA Field at Arrowhead",capacity:76416,location:"Kansas City, MO",date:"6/16",day:"Tue",time:"",pMin:681.39,p25:1100.00,p50:1849.00,ticketQty:3688,listingQty:834,visits7d:60393,trans7d:32,pos:"https://reachpro.com/inventory/event?eventId=153021561",gotickets:"https://pro.gotickets.com/tickets/541402/2026-fifa-world-cup-match-19-group-j-tickets/geha-field-at-arrowhead-stadium-kansas-city-mo-6-16-2026"},
{id:20,name:"Austria vs Jordan",group:"J",venue:"Levi's Stadium",capacity:75000,location:"Santa Clara, CA",date:"6/16",day:"Tue",time:"",pMin:184.00,p25:456.45,p50:700.00,ticketQty:3345,listingQty:783,visits7d:58914,trans7d:27,pos:"https://reachpro.com/inventory/event?eventId=153020625",gotickets:"https://pro.gotickets.com/tickets/541444/2026-fifa-world-cup-match-20-group-j-tickets/levi-s-stadium-santa-clara-ca-6-16-2026"},
{id:21,name:"Ghana vs Panama",group:"L",venue:"BMO Field",capacity:30000,location:"Toronto, Canada",date:"6/17",day:"Wed",time:"",pMin:369.22,p25:599.58,p50:881.28,ticketQty:2248,listingQty:457,visits7d:58262,trans7d:27,pos:"https://reachpro.com/inventory/event?eventId=153022614",gotickets:"https://pro.gotickets.com/tickets/541363/2026-fifa-world-cup-match-21-group-l-tickets/bmo-field-toronto-on-6-17-2026"},
{id:22,name:"England vs Croatia",group:"L",venue:"AT&T Stadium",capacity:80000,location:"Arlington, TX",date:"6/17",day:"Wed",time:"",pMin:881.05,p25:1608.45,p50:2601.01,ticketQty:3954,listingQty:748,visits7d:46784,trans7d:32,pos:"https://reachpro.com/inventory/event?eventId=153021378",gotickets:"https://pro.gotickets.com/tickets/541318/2026-fifa-world-cup-match-22-group-l-tickets/at-t-stadium-arlington-tx-6-17-2026"},
{id:23,name:"Portugal vs TBD",group:"K",venue:"NRG Stadium",capacity:71500,location:"Houston, TX",date:"6/17",day:"Wed",time:"",pMin:562.12,p25:921.50,p50:1493.08,ticketQty:4221,listingQty:956,visits7d:63562,trans7d:37,pos:"https://reachpro.com/inventory/event?eventId=153020837",gotickets:"https://pro.gotickets.com/tickets/541531/2026-fifa-world-cup-match-23-group-k-tickets/nrg-stadium-houston-tx-6-17-2026"},
{id:24,name:"Uzbekistan vs Colombia",group:"K",venue:"Estadio Azteca",capacity:98500,location:"Ciudad de Mexico",date:"6/17",day:"Wed",time:"",pMin:573.11,p25:801.91,p50:1080.77,ticketQty:2356,listingQty:454,visits7d:53527,trans7d:55,pos:"https://reachpro.com/inventory/event?eventId=153033433",gotickets:"https://pro.gotickets.com/tickets/541372/2026-fifa-world-cup-match-24-group-k-tickets/estadio-azteca-ciudad-de-m-xico-cdmx-6-17-2026"},
{id:25,name:"TBD vs South Africa",group:"A",venue:"Mercedes-Benz Stadium",capacity:71000,location:"Atlanta, GA",date:"6/18",day:"Thu",time:"",pMin:246.56,p25:490.59,p50:809.55,ticketQty:3061,listingQty:650,visits7d:45333,trans7d:26,pos:"https://reachpro.com/inventory/event?eventId=153022626",gotickets:"https://pro.gotickets.com/tickets/541505/2026-fifa-world-cup-match-25-group-a-tickets/mercedes-benz-stadium-atlanta-ga-6-18-2026"},
{id:26,name:"Switzerland vs TBD",group:"B",venue:"SoFi Stadium",capacity:70240,location:"Inglewood, CA",date:"6/18",day:"Thu",time:"",pMin:421.23,p25:717.35,p50:1214.23,ticketQty:3397,listingQty:734,visits7d:31770,trans7d:19,pos:"https://reachpro.com/inventory/event?eventId=153020716",gotickets:"https://pro.gotickets.com/tickets/541541/2026-fifa-world-cup-match-26-group-b-tickets/sofi-stadium-inglewood-ca-6-18-2026"},
{id:27,name:"Canada vs Qatar",group:"B",venue:"BC Place Stadium",capacity:54500,location:"Vancouver, Canada",date:"6/18",day:"Thu",time:"",pMin:396.00,p25:823.18,p50:1153.86,ticketQty:2798,listingQty:581,visits7d:53787,trans7d:30,pos:"https://reachpro.com/inventory/event?eventId=153020461",gotickets:"https://pro.gotickets.com/tickets/541348/2026-fifa-world-cup-match-27-group-b-canada-vs-tbd-tickets/bc-place-stadium-vancouver-bc-6-18-2026"},
{id:28,name:"Mexico vs Korea Republic",group:"A",venue:"Estadio Akron",capacity:49800,location:"Zapopan, Mexico",date:"6/18",day:"Thu",time:"",pMin:1364.88,p25:2486.38,p50:3870.16,ticketQty:2967,listingQty:431,visits7d:58898,trans7d:23,pos:"https://reachpro.com/inventory/event?eventId=153033451",gotickets:"https://pro.gotickets.com/tickets/544921/2026-fifa-world-cup-match-28-group-a-mexico-vs-tbd-tickets/akron-stadium-mexico-zapopan-jal-6-18-2026"},
{id:29,name:"Brazil vs Haiti",group:"C",venue:"Lincoln Financial Field",capacity:69176,location:"Philadelphia, PA",date:"6/19",day:"Fri",time:"",pMin:648.00,p25:1028.98,p50:1476.55,ticketQty:3761,listingQty:787,visits7d:54791,trans7d:31,pos:"https://reachpro.com/inventory/event?eventId=153022742",gotickets:"https://pro.gotickets.com/tickets/541469/2026-fifa-world-cup-match-29-group-c-tickets/lincoln-financial-field-philadelphia-pa-6-19-2026"},
{id:30,name:"Scotland vs Morocco",group:"C",venue:"Gillette Stadium",capacity:68756,location:"Foxborough, MA",date:"6/19",day:"Fri",time:"",pMin:568.66,p25:900.00,p50:1335.60,ticketQty:3397,listingQty:723,visits7d:41292,trans7d:16,pos:"https://reachpro.com/inventory/event?eventId=153022637",gotickets:"https://pro.gotickets.com/tickets/541420/2026-fifa-world-cup-match-30-group-c-tickets/gillette-stadium-foxborough-ma-6-19-2026"},
{id:31,name:"TBD vs Paraguay",group:"D",venue:"Levi's Stadium",capacity:75000,location:"Santa Clara, CA",date:"6/19",day:"Fri",time:"",pMin:241.96,p25:540.00,p50:926.10,ticketQty:3022,listingQty:657,visits7d:51266,trans7d:23,pos:"https://reachpro.com/inventory/event?eventId=153020644",gotickets:"https://pro.gotickets.com/tickets/541445/2026-fifa-world-cup-match-31-group-d-tickets/levi-s-stadium-santa-clara-ca-6-19-2026"},
{id:32,name:"USA vs Australia",group:"D",venue:"Lumen Field",capacity:67000,location:"Seattle, WA",date:"6/19",day:"Fri",time:"",pMin:1116.25,p25:1818.56,p50:3078.25,ticketQty:3487,listingQty:679,visits7d:61260,trans7d:21,pos:"https://reachpro.com/inventory/event?eventId=153020544",gotickets:"https://pro.gotickets.com/tickets/541487/2026-fifa-world-cup-match-32-group-d-usa-vs-tbd-tickets/lumen-field-seattle-wa-6-19-2026"},
{id:33,name:"Germany vs Cote d'Ivoire",group:"E",venue:"BMO Field",capacity:30000,location:"Toronto, Canada",date:"6/20",day:"Sat",time:"",pMin:609.83,p25:934.92,p50:1238.03,ticketQty:2492,listingQty:463,visits7d:63702,trans7d:36,pos:"https://reachpro.com/inventory/event?eventId=153022796",gotickets:"https://pro.gotickets.com/tickets/541364/2026-fifa-world-cup-match-33-group-e-tickets/bmo-field-toronto-on-6-20-2026"},
{id:34,name:"Ecuador vs Curacao",group:"E",venue:"GEHA Field at Arrowhead",capacity:76416,location:"Kansas City, MO",date:"6/20",day:"Sat",time:"",pMin:298.30,p25:526.33,p50:758.28,ticketQty:3049,listingQty:686,visits7d:52291,trans7d:26,pos:"https://reachpro.com/inventory/event?eventId=153021562",gotickets:"https://pro.gotickets.com/tickets/541403/2026-fifa-world-cup-match-34-group-e-tickets/geha-field-at-arrowhead-stadium-kansas-city-mo-6-20-2026"},
{id:35,name:"Netherlands vs TBA",group:"F",venue:"NRG Stadium",capacity:71500,location:"Houston, TX",date:"6/20",day:"Sat",time:"",pMin:377.48,p25:708.77,p50:1057.50,ticketQty:3024,listingQty:649,visits7d:45724,trans7d:23,pos:"https://reachpro.com/inventory/event?eventId=153020842",gotickets:"https://pro.gotickets.com/tickets/541532/2026-fifa-world-cup-match-35-group-f-tickets/nrg-stadium-houston-tx-6-20-2026"},
{id:36,name:"Tunisia vs Japan",group:"F",venue:"Estadio BBVA Bancomer",capacity:52237,location:"Monterrey, Mexico",date:"6/20",day:"Sat",time:"",pMin:225.31,p25:375.00,p50:583.16,ticketQty:1808,listingQty:373,visits7d:55997,trans7d:38,pos:"https://reachpro.com/inventory/event?eventId=153033460",gotickets:"https://pro.gotickets.com/tickets/541385/2026-fifa-world-cup-match-36-group-f-tickets/estadio-bbva-guadalupe-n-l-6-20-2026"},
{id:37,name:"Uruguay vs Cabo Verde",group:"H",venue:"Hard Rock Stadium",capacity:76100,location:"Miami Gardens, FL",date:"6/21",day:"Sun",time:"",pMin:301.76,p25:422.85,p50:674.01,ticketQty:3684,listingQty:872,visits7d:58580,trans7d:24,pos:"https://reachpro.com/inventory/event?eventId=153023087",gotickets:"https://pro.gotickets.com/tickets/541434/2026-fifa-world-cup-match-37-group-h-tickets/hard-rock-stadium-miami-gardens-fl-6-21-2026"},
{id:38,name:"Spain vs Saudi Arabia",group:"H",venue:"Mercedes-Benz Stadium",capacity:71000,location:"Atlanta, GA",date:"6/21",day:"Sun",time:"",pMin:384.26,p25:704.30,p50:1128.60,ticketQty:3519,listingQty:735,visits7d:53945,trans7d:54,pos:"https://reachpro.com/inventory/event?eventId=153022910",gotickets:"https://pro.gotickets.com/tickets/541506/2026-fifa-world-cup-match-38-group-h-tickets/mercedes-benz-stadium-atlanta-ga-6-21-2026"},
{id:39,name:"Belgium vs Iran",group:"G",venue:"SoFi Stadium",capacity:70240,location:"Inglewood, CA",date:"6/21",day:"Sun",time:"",pMin:255.77,p25:583.13,p50:956.46,ticketQty:4373,listingQty:1069,visits7d:56656,trans7d:36,pos:"https://reachpro.com/inventory/event?eventId=153020717",gotickets:"https://pro.gotickets.com/tickets/541542/2026-fifa-world-cup-match-39-group-g-tickets/sofi-stadium-inglewood-ca-6-21-2026"},
{id:40,name:"New Zealand vs Egypt",group:"G",venue:"BC Place Stadium",capacity:54500,location:"Vancouver, Canada",date:"6/21",day:"Sun",time:"",pMin:285.00,p25:430.86,p50:815.65,ticketQty:2437,listingQty:488,visits7d:52775,trans7d:9,pos:"https://reachpro.com/inventory/event?eventId=154852936",gotickets:"https://pro.gotickets.com/tickets/541349/2026-fifa-world-cup-match-40-group-g-tickets/bc-place-stadium-vancouver-bc-6-21-2026"},
{id:41,name:"Norway vs Senegal",group:"I",venue:"MetLife Stadium",capacity:82500,location:"East Rutherford, NJ",date:"6/22",day:"Mon",time:"",pMin:371.24,p25:642.79,p50:981.16,ticketQty:3343,listingQty:756,visits7d:59735,trans7d:29,pos:"https://reachpro.com/inventory/event?eventId=153023354",gotickets:"https://pro.gotickets.com/tickets/541517/2026-fifa-world-cup-match-41-group-i-tickets/metlife-stadium-east-rutherford-nj-6-22-2026"},
{id:42,name:"France vs TBD",group:"I",venue:"Lincoln Financial Field",capacity:69176,location:"Philadelphia, PA",date:"6/22",day:"Mon",time:"",pMin:438.26,p25:699.51,p50:994.74,ticketQty:3348,listingQty:785,visits7d:57938,trans7d:57,pos:"https://reachpro.com/inventory/event?eventId=153023094",gotickets:"https://pro.gotickets.com/tickets/541470/2026-fifa-world-cup-match-42-group-i-tickets/lincoln-financial-field-philadelphia-pa-6-22-2026"},
{id:43,name:"Argentina vs Austria",group:"J",venue:"AT&T Stadium",capacity:80000,location:"Arlington, TX",date:"6/22",day:"Mon",time:"",pMin:989.39,p25:1733.96,p50:3202.31,ticketQty:3879,listingQty:723,visits7d:60702,trans7d:25,pos:"https://reachpro.com/inventory/event?eventId=153021379",gotickets:"https://pro.gotickets.com/tickets/541319/2026-fifa-world-cup-match-43-group-j-tickets/at-t-stadium-arlington-tx-6-22-2026"},
{id:44,name:"Jordan vs Algeria",group:"J",venue:"Levi's Stadium",capacity:75000,location:"Santa Clara, CA",date:"6/22",day:"Mon",time:"",pMin:180.00,p25:411.75,p50:683.80,ticketQty:3392,listingQty:798,visits7d:56164,trans7d:19,pos:"https://reachpro.com/inventory/event?eventId=153020662",gotickets:"https://pro.gotickets.com/tickets/541446/2026-fifa-world-cup-match-44-group-j-tickets/levi-s-stadium-santa-clara-ca-6-22-2026"},
{id:45,name:"England vs Ghana",group:"L",venue:"Gillette Stadium",capacity:68756,location:"Foxborough, MA",date:"6/23",day:"Tue",time:"",pMin:585.00,p25:975.55,p50:1628.79,ticketQty:2887,listingQty:624,visits7d:51414,trans7d:29,pos:"https://reachpro.com/inventory/event?eventId=153023421",gotickets:"https://pro.gotickets.com/tickets/541421/2026-fifa-world-cup-match-45-group-l-tickets/gillette-stadium-foxborough-ma-6-23-2026"},
{id:46,name:"Panama vs Croatia",group:"L",venue:"BMO Field",capacity:30000,location:"Toronto, Canada",date:"6/23",day:"Tue",time:"",pMin:455.00,p25:608.40,p50:949.97,ticketQty:2466,listingQty:561,visits7d:61876,trans7d:45,pos:"https://reachpro.com/inventory/event?eventId=153023376",gotickets:"https://pro.gotickets.com/tickets/541365/2026-fifa-world-cup-match-46-group-l-tickets/bmo-field-toronto-on-6-23-2026"},
{id:47,name:"Portugal vs Uzbekistan",group:"K",venue:"NRG Stadium",capacity:71500,location:"Houston, TX",date:"6/23",day:"Tue",time:"",pMin:552.00,p25:850.00,p50:1276.00,ticketQty:4239,listingQty:950,visits7d:55665,trans7d:35,pos:"https://reachpro.com/inventory/event?eventId=153020851",gotickets:"https://pro.gotickets.com/tickets/541533/2026-fifa-world-cup-match-47-group-k-tickets/nrg-stadium-houston-tx-6-23-2026"},
{id:48,name:"Colombia vs TBD",group:"K",venue:"Estadio Akron",capacity:49800,location:"Zapopan, Mexico",date:"6/23",day:"Tue",time:"",pMin:622.02,p25:900.00,p50:1336.87,ticketQty:2040,listingQty:390,visits7d:58361,trans7d:16,pos:"https://reachpro.com/inventory/event?eventId=153033471",gotickets:"https://pro.gotickets.com/tickets/544922/2026-fifa-world-cup-match-48-group-k-tickets/akron-stadium-mexico-zapopan-jal-6-23-2026"},
{id:49,name:"Scotland vs Brazil",group:"C",venue:"Hard Rock Stadium",capacity:76100,location:"Miami Gardens, FL",date:"6/24",day:"Wed",time:"6:00PM",pMin:1096.38,p25:1848.00,p50:3285.00,ticketQty:4271,listingQty:809,visits7d:52670,trans7d:33,pos:"https://reachpro.com/inventory/event?eventId=153023575",gotickets:"https://pro.gotickets.com/tickets/541435/2026-fifa-world-cup-match-49-group-c-tickets/hard-rock-stadium-miami-gardens-fl-6-24-2026"},
{id:50,name:"Morocco vs Haiti",group:"C",venue:"Mercedes-Benz Stadium",capacity:71000,location:"Atlanta, GA",date:"6/24",day:"Wed",time:"",pMin:232.33,p25:479.83,p50:750.00,ticketQty:3910,listingQty:915,visits7d:54215,trans7d:33,pos:"https://reachpro.com/inventory/event?eventId=153023548",gotickets:"https://pro.gotickets.com/tickets/541507/2026-fifa-world-cup-match-50-group-c-tickets/mercedes-benz-stadium-atlanta-ga-6-24-2026"},
{id:51,name:"Switzerland vs Canada",group:"B",venue:"BC Place Stadium",capacity:54500,location:"Vancouver, Canada",date:"6/24",day:"Wed",time:"",pMin:346.50,p25:855.00,p50:1216.15,ticketQty:3196,listingQty:698,visits7d:60889,trans7d:24,pos:"https://reachpro.com/inventory/event?eventId=153020467",gotickets:"https://pro.gotickets.com/tickets/541350/2026-fifa-world-cup-match-51-group-b-canada-vs-tbd-tickets/bc-place-stadium-vancouver-bc-6-24-2026"},
{id:52,name:"TBD vs Qatar",group:"B",venue:"Lumen Field",capacity:67000,location:"Seattle, WA",date:"6/24",day:"Wed",time:"",pMin:314.99,p25:592.69,p50:1205.19,ticketQty:2753,listingQty:588,visits7d:34093,trans7d:15,pos:"https://reachpro.com/inventory/event?eventId=153020556",gotickets:"https://pro.gotickets.com/tickets/541488/2026-fifa-world-cup-match-52-group-b-tickets/lumen-field-seattle-wa-6-24-2026"},
{id:53,name:"TBD vs Mexico",group:"A",venue:"Estadio Azteca",capacity:98500,location:"Ciudad de Mexico",date:"6/24",day:"Wed",time:"",pMin:1320.12,p25:2156.00,p50:4500.00,ticketQty:2420,listingQty:391,visits7d:32322,trans7d:16,pos:"https://reachpro.com/inventory/event?eventId=153033484",gotickets:"https://pro.gotickets.com/tickets/541373/2026-fifa-world-cup-match-53-group-a-tickets/estadio-azteca-ciudad-de-m-xico-cdmx-6-24-2026"},
{id:54,name:"South Africa vs Korea Republic",group:"A",venue:"Estadio BBVA Bancomer",capacity:52237,location:"Monterrey, Mexico",date:"6/24",day:"Wed",time:"",pMin:180.24,p25:323.84,p50:576.00,ticketQty:1781,listingQty:353,visits7d:35525,trans7d:9,pos:"https://reachpro.com/inventory/event?eventId=153033494",gotickets:"https://pro.gotickets.com/tickets/541386/2026-fifa-world-cup-match-54-group-a-tickets/estadio-bbva-guadalupe-n-l-6-24-2026"},
{id:55,name:"Curacao vs Cote d'Ivoire",group:"E",venue:"Lincoln Financial Field",capacity:69176,location:"Philadelphia, PA",date:"6/25",day:"Thu",time:"",pMin:237.00,p25:400.00,p50:799.14,ticketQty:3078,listingQty:690,visits7d:52151,trans7d:17,pos:"https://reachpro.com/inventory/event?eventId=153023579",gotickets:"https://pro.gotickets.com/tickets/541471/2026-fifa-world-cup-match-55-group-e-tickets/lincoln-financial-field-philadelphia-pa-6-25-2026"},
{id:56,name:"Ecuador vs Germany",group:"E",venue:"MetLife Stadium",capacity:82500,location:"East Rutherford, NJ",date:"6/25",day:"Thu",time:"",pMin:800.40,p25:1334.47,p50:2389.50,ticketQty:4721,listingQty:966,visits7d:57600,trans7d:48,pos:"https://reachpro.com/inventory/event?eventId=153023689",gotickets:"https://pro.gotickets.com/tickets/541518/2026-fifa-world-cup-match-56-group-e-tickets/metlife-stadium-east-rutherford-nj-6-25-2026"},
{id:57,name:"Japan vs TBD",group:"F",venue:"AT&T Stadium",capacity:80000,location:"Arlington, TX",date:"6/25",day:"Thu",time:"",pMin:449.80,p25:680.00,p50:1080.00,ticketQty:2656,listingQty:565,visits7d:53833,trans7d:16,pos:"https://reachpro.com/inventory/event?eventId=153021390",gotickets:"https://pro.gotickets.com/tickets/541320/2026-fifa-world-cup-match-57-group-f-tickets/at-t-stadium-arlington-tx-6-25-2026"},
{id:58,name:"Tunisia vs Netherlands",group:"F",venue:"GEHA Field at Arrowhead",capacity:76416,location:"Kansas City, MO",date:"6/25",day:"Thu",time:"",pMin:333.27,p25:565.33,p50:1181.82,ticketQty:2946,listingQty:628,visits7d:53437,trans7d:19,pos:"https://reachpro.com/inventory/event?eventId=153021563",gotickets:"https://pro.gotickets.com/tickets/541404/2026-fifa-world-cup-match-58-group-f-tickets/geha-field-at-arrowhead-stadium-kansas-city-mo-6-25-2026"},
{id:59,name:"TBD vs USA",group:"D",venue:"SoFi Stadium",capacity:70240,location:"Inglewood, CA",date:"6/25",day:"Thu",time:"",pMin:866.36,p25:1603.42,p50:2700.00,ticketQty:3100,listingQty:666,visits7d:53391,trans7d:18,pos:"https://reachpro.com/inventory/event?eventId=153020718",gotickets:"https://pro.gotickets.com/tickets/541543/2026-fifa-world-cup-match-59-group-d-usa-vs-tbd-tickets/sofi-stadium-inglewood-ca-6-25-2026"},
{id:60,name:"Paraguay vs Australia",group:"D",venue:"Levi's Stadium",capacity:75000,location:"Santa Clara, CA",date:"6/25",day:"Thu",time:"",pMin:335.00,p25:607.49,p50:1169.10,ticketQty:3095,listingQty:683,visits7d:53338,trans7d:17,pos:"https://reachpro.com/inventory/event?eventId=153020677",gotickets:"https://pro.gotickets.com/tickets/541447/2026-fifa-world-cup-match-60-group-d-tickets/levi-s-stadium-santa-clara-ca-6-25-2026"},
{id:61,name:"Norway vs France",group:"I",venue:"Gillette Stadium",capacity:68756,location:"Foxborough, MA",date:"6/26",day:"Fri",time:"",pMin:700.39,p25:1199.53,p50:2156.00,ticketQty:4348,listingQty:871,visits7d:59816,trans7d:34,pos:"https://reachpro.com/inventory/event?eventId=153023735",gotickets:"https://pro.gotickets.com/tickets/541422/2026-fifa-world-cup-match-61-group-i-tickets/gillette-stadium-foxborough-ma-6-26-2026"},
{id:62,name:"Senegal vs TBD",group:"I",venue:"BMO Field",capacity:30000,location:"Toronto, Canada",date:"6/26",day:"Fri",time:"",pMin:394.07,p25:588.00,p50:805.00,ticketQty:1984,listingQty:413,visits7d:35975,trans7d:6,pos:"https://reachpro.com/inventory/event?eventId=153023734",gotickets:"https://pro.gotickets.com/tickets/541366/2026-fifa-world-cup-match-62-group-i-tickets/bmo-field-toronto-on-6-26-2026"},
{id:63,name:"Egypt vs Iran",group:"G",venue:"Lumen Field",capacity:67000,location:"Seattle, WA",date:"6/26",day:"Fri",time:"",pMin:216.00,p25:462.90,p50:900.00,ticketQty:3493,listingQty:756,visits7d:58295,trans7d:14,pos:"https://reachpro.com/inventory/event?eventId=153020570",gotickets:"https://pro.gotickets.com/tickets/541489/2026-fifa-world-cup-match-63-group-g-tickets/lumen-field-seattle-wa-6-26-2026"},
{id:64,name:"New Zealand vs Belgium",group:"G",venue:"BC Place Stadium",capacity:54500,location:"Vancouver, Canada",date:"6/26",day:"Fri",time:"",pMin:279.46,p25:516.87,p50:998.68,ticketQty:2666,listingQty:550,visits7d:35739,trans7d:25,pos:"https://reachpro.com/inventory/event?eventId=153020469",gotickets:"https://pro.gotickets.com/tickets/541351/2026-fifa-world-cup-match-64-group-g-tickets/bc-place-stadium-vancouver-bc-6-26-2026"},
{id:65,name:"Cabo Verde vs Saudi Arabia",group:"H",venue:"NRG Stadium",capacity:71500,location:"Houston, TX",date:"6/26",day:"Fri",time:"",pMin:153.63,p25:355.00,p50:926.93,ticketQty:4037,listingQty:881,visits7d:57555,trans7d:17,pos:"https://reachpro.com/inventory/event?eventId=153020962",gotickets:"https://pro.gotickets.com/tickets/541534/2026-fifa-world-cup-match-65-group-h-tickets/nrg-stadium-houston-tx-6-26-2026"},
{id:66,name:"Uruguay vs Spain",group:"H",venue:"Estadio Akron",capacity:49800,location:"Zapopan, Mexico",date:"6/26",day:"Fri",time:"",pMin:846.50,p25:1385.14,p50:2430.50,ticketQty:2695,listingQty:512,visits7d:37396,trans7d:25,pos:"https://reachpro.com/inventory/event?eventId=156535642",gotickets:"https://pro.gotickets.com/tickets/544923/2026-fifa-world-cup-match-66-group-h-tickets/akron-stadium-mexico-zapopan-jal-6-26-2026"},
{id:67,name:"Panama vs England",group:"L",venue:"MetLife Stadium",capacity:82500,location:"East Rutherford, NJ",date:"6/27",day:"Sat",time:"",pMin:600.00,p25:1175.07,p50:1837.00,ticketQty:4725,listingQty:947,visits7d:49778,trans7d:42,pos:"https://reachpro.com/inventory/event?eventId=153023828",gotickets:"https://pro.gotickets.com/tickets/541519/2026-fifa-world-cup-match-67-group-l-tickets/metlife-stadium-east-rutherford-nj-6-27-2026"},
{id:68,name:"Croatia vs Ghana",group:"L",venue:"Lincoln Financial Field",capacity:69176,location:"Philadelphia, PA",date:"6/27",day:"Sat",time:"",pMin:386.56,p25:694.64,p50:1200.00,ticketQty:3395,listingQty:737,visits7d:59056,trans7d:48,pos:"https://reachpro.com/inventory/event?eventId=153023766",gotickets:"https://pro.gotickets.com/tickets/541472/2026-fifa-world-cup-match-68-group-l-tickets/lincoln-financial-field-philadelphia-pa-6-27-2026"},
{id:69,name:"Algeria vs Austria",group:"J",venue:"GEHA Field at Arrowhead",capacity:76416,location:"Kansas City, MO",date:"6/27",day:"Sat",time:"",pMin:274.50,p25:538.02,p50:1465.97,ticketQty:3002,listingQty:617,visits7d:52774,trans7d:12,pos:"https://reachpro.com/inventory/event?eventId=153021572",gotickets:"https://pro.gotickets.com/tickets/541405/2026-fifa-world-cup-match-69-group-j-tickets/geha-field-at-arrowhead-stadium-kansas-city-mo-6-27-2026"},
{id:70,name:"Jordan vs Argentina",group:"J",venue:"AT&T Stadium",capacity:80000,location:"Arlington, TX",date:"6/27",day:"Sat",time:"",pMin:762.97,p25:1192.50,p50:1925.13,ticketQty:3221,listingQty:713,visits7d:53786,trans7d:28,pos:"https://reachpro.com/inventory/event?eventId=153021391",gotickets:"https://pro.gotickets.com/tickets/541321/2026-fifa-world-cup-match-70-group-j-tickets/at-t-stadium-arlington-tx-6-27-2026"},
{id:71,name:"Colombia vs Portugal",group:"K",venue:"Hard Rock Stadium",capacity:76100,location:"Miami Gardens, FL",date:"6/27",day:"Sat",time:"",pMin:1553.31,p25:3060.00,p50:6230.00,ticketQty:5796,listingQty:1020,visits7d:68282,trans7d:55,pos:"https://reachpro.com/inventory/event?eventId=153023764",gotickets:"https://pro.gotickets.com/tickets/541436/2026-fifa-world-cup-match-71-group-k-tickets/hard-rock-stadium-miami-gardens-fl-6-27-2026"},
{id:72,name:"TBD vs Uzbekistan",group:"K",venue:"Mercedes-Benz Stadium",capacity:71000,location:"Atlanta, GA",date:"6/27",day:"Sat",time:"",pMin:200.00,p25:439.43,p50:894.60,ticketQty:3381,listingQty:740,visits7d:52757,trans7d:17,pos:"https://reachpro.com/inventory/event?eventId=153023736",gotickets:"https://pro.gotickets.com/tickets/541508/2026-fifa-world-cup-match-72-group-k-tickets/mercedes-benz-stadium-atlanta-ga-6-27-2026"},
{id:73,name:"R32: 2A vs 2B",group:"KO",venue:"SoFi Stadium",capacity:70240,location:"Inglewood, CA",date:"6/28",day:"Sun",time:"",pMin:619.24,p25:1039.57,p50:1743.20,ticketQty:3882,listingQty:849,visits7d:43191,trans7d:23,pos:"https://reachpro.com/inventory/event?eventId=153020724",gotickets:"https://pro.gotickets.com/tickets/541544/2026-fifa-world-cup-match-73-tickets/sofi-stadium-inglewood-ca-6-28-2026"},
{id:74,name:"R32: 1E vs 3rd",group:"KO",venue:"Gillette Stadium",capacity:68756,location:"Foxborough, MA",date:"6/29",day:"Mon",time:"",pMin:555.78,p25:894.94,p50:1531.25,ticketQty:3394,listingQty:736,visits7d:23119,trans7d:14,pos:"https://reachpro.com/inventory/event?eventId=153023830",gotickets:"https://pro.gotickets.com/tickets/541423/2026-fifa-world-cup-match-74-tickets/gillette-stadium-foxborough-ma-6-29-2026"},
{id:75,name:"R32: 1F vs 2C",group:"KO",venue:"Estadio BBVA Bancomer",capacity:52237,location:"Monterrey, Mexico",date:"6/29",day:"Mon",time:"",pMin:485.00,p25:737.66,p50:1176.00,ticketQty:2083,listingQty:410,visits7d:26205,trans7d:15,pos:"https://reachpro.com/inventory/event?eventId=153033502",gotickets:"https://pro.gotickets.com/tickets/541387/2026-fifa-world-cup-match-75-tickets/estadio-bbva-guadalupe-n-l-6-29-2026"},
{id:76,name:"R32: 1C vs 2F",group:"KO",venue:"NRG Stadium",capacity:71500,location:"Houston, TX",date:"6/29",day:"Mon",time:"",pMin:608.69,p25:976.39,p50:1710.21,ticketQty:3724,listingQty:801,visits7d:37960,trans7d:14,pos:"https://reachpro.com/inventory/event?eventId=153021172",gotickets:"https://pro.gotickets.com/tickets/541535/2026-fifa-world-cup-match-76-tickets/nrg-stadium-houston-tx-6-29-2026"},
{id:77,name:"R32: 1I vs 3rd",group:"KO",venue:"MetLife Stadium",capacity:82500,location:"East Rutherford, NJ",date:"6/30",day:"Tue",time:"",pMin:639.20,p25:978.97,p50:1570.00,ticketQty:3620,listingQty:811,visits7d:23391,trans7d:18,pos:"https://reachpro.com/inventory/event?eventId=153023840",gotickets:"https://pro.gotickets.com/tickets/541520/2026-fifa-world-cup-match-77-tickets/metlife-stadium-east-rutherford-nj-6-30-2026"},
{id:78,name:"R32: 2E vs 2I",group:"KO",venue:"AT&T Stadium",capacity:80000,location:"Arlington, TX",date:"6/30",day:"Tue",time:"",pMin:452.77,p25:840.00,p50:1452.53,ticketQty:3731,listingQty:817,visits7d:26015,trans7d:13,pos:"https://reachpro.com/inventory/event?eventId=153021470",gotickets:"https://pro.gotickets.com/tickets/541322/2026-fifa-world-cup-match-78-tickets/at-t-stadium-arlington-tx-6-30-2026"},
{id:79,name:"R32: 1A vs 3rd",group:"KO",venue:"Estadio Azteca",capacity:98500,location:"Ciudad de Mexico",date:"6/30",day:"Tue",time:"",pMin:672.10,p25:1042.08,p50:1547.73,ticketQty:2064,listingQty:370,visits7d:22784,trans7d:14,pos:"https://reachpro.com/inventory/event?eventId=153033506",gotickets:"https://pro.gotickets.com/tickets/541374/2026-fifa-world-cup-match-79-tickets/estadio-azteca-ciudad-de-m-xico-cdmx-6-30-2026"},
{id:80,name:"R32: 1L vs 3rd",group:"KO",venue:"Mercedes-Benz Stadium",capacity:71000,location:"Atlanta, GA",date:"7/1",day:"Wed",time:"",pMin:506.60,p25:890.89,p50:1623.59,ticketQty:3634,listingQty:789,visits7d:22966,trans7d:18,pos:"https://reachpro.com/inventory/event?eventId=153023846",gotickets:"https://pro.gotickets.com/tickets/541509/2026-fifa-world-cup-match-80-tickets/mercedes-benz-stadium-atlanta-ga-7-1-2026"},
{id:81,name:"R32: 1D vs 3rd",group:"KO",venue:"Levi's Stadium",capacity:75000,location:"Santa Clara, CA",date:"7/1",day:"Wed",time:"",pMin:625.00,p25:1035.00,p50:1800.00,ticketQty:4167,listingQty:933,visits7d:23364,trans7d:19,pos:"https://reachpro.com/inventory/event?eventId=153020696",gotickets:"https://pro.gotickets.com/tickets/541448/2026-fifa-world-cup-match-81-tickets/levi-s-stadium-santa-clara-ca-7-1-2026"},
{id:82,name:"R32: 1G vs 3rd",group:"KO",venue:"Lumen Field",capacity:67000,location:"Seattle, WA",date:"7/1",day:"Wed",time:"",pMin:408.74,p25:803.12,p50:1437.72,ticketQty:3570,listingQty:764,visits7d:22363,trans7d:9,pos:"https://reachpro.com/inventory/event?eventId=153020573",gotickets:"https://pro.gotickets.com/tickets/541490/2026-fifa-world-cup-match-82-tickets/lumen-field-seattle-wa-7-1-2026"},
{id:83,name:"R32: 2K vs 2L",group:"KO",venue:"BMO Field",capacity:30000,location:"Toronto, Canada",date:"7/2",day:"Thu",time:"",pMin:972.61,p25:1427.05,p50:2389.50,ticketQty:2091,listingQty:421,visits7d:28387,trans7d:13,pos:"https://reachpro.com/inventory/event?eventId=153023856",gotickets:"https://pro.gotickets.com/tickets/541367/2026-fifa-world-cup-match-83-tickets/bmo-field-toronto-on-7-2-2026"},
{id:84,name:"R32: 1H vs 2J",group:"KO",venue:"SoFi Stadium",capacity:70240,location:"Inglewood, CA",date:"7/2",day:"Thu",time:"",pMin:698.54,p25:1169.10,p50:1797.92,ticketQty:3695,listingQty:839,visits7d:26568,trans7d:22,pos:"https://reachpro.com/inventory/event?eventId=153020726",gotickets:"https://pro.gotickets.com/tickets/541545/2026-fifa-world-cup-match-84-tickets/sofi-stadium-inglewood-ca-7-2-2026"},
{id:85,name:"R32: 1B vs 3rd",group:"KO",venue:"BC Place Stadium",capacity:54500,location:"Vancouver, Canada",date:"7/2",day:"Thu",time:"",pMin:588.00,p25:1036.88,p50:1715.89,ticketQty:3042,listingQty:616,visits7d:67820,trans7d:8,pos:"https://reachpro.com/inventory/event?eventId=153020498",gotickets:"https://pro.gotickets.com/tickets/541352/2026-fifa-world-cup-match-85-tickets/bc-place-stadium-vancouver-bc-7-2-2026"},
{id:86,name:"R32: 1J vs 2H",group:"KO",venue:"Hard Rock Stadium",capacity:76100,location:"Miami Gardens, FL",date:"7/3",day:"Fri",time:"",pMin:1439.48,p25:2250.00,p50:3978.00,ticketQty:4104,listingQty:774,visits7d:71854,trans7d:8,pos:"https://reachpro.com/inventory/event?eventId=153023861",gotickets:"https://pro.gotickets.com/tickets/541437/2026-fifa-world-cup-match-86-tickets/hard-rock-stadium-miami-gardens-fl-7-3-2026"},
{id:87,name:"R32: 1K vs 3rd",group:"KO",venue:"GEHA Field at Arrowhead",capacity:76416,location:"Kansas City, MO",date:"7/3",day:"Fri",time:"",pMin:570.36,p25:900.00,p50:1705.10,ticketQty:4054,listingQty:894,visits7d:67802,trans7d:27,pos:"https://reachpro.com/inventory/event?eventId=153021573",gotickets:"https://pro.gotickets.com/tickets/541406/2026-fifa-world-cup-match-87-tickets/geha-field-at-arrowhead-stadium-kansas-city-mo-7-3-2026"},
{id:88,name:"R32: 2D vs 2G",group:"KO",venue:"AT&T Stadium",capacity:80000,location:"Arlington, TX",date:"7/3",day:"Fri",time:"",pMin:514.73,p25:862.08,p50:1324.19,ticketQty:3484,listingQty:762,visits7d:71066,trans7d:13,pos:"https://reachpro.com/inventory/event?eventId=153021509",gotickets:"https://pro.gotickets.com/tickets/541323/2026-fifa-world-cup-match-88-tickets/at-t-stadium-arlington-tx-7-3-2026"},
{id:89,name:"R16: W74 vs W77",group:"KO",venue:"Lincoln Financial Field",capacity:69176,location:"Philadelphia, PA",date:"7/4",day:"Sat",time:"",pMin:846.53,p25:1600.56,p50:2517.93,ticketQty:3370,listingQty:732,visits7d:72012,trans7d:14,pos:"https://reachpro.com/inventory/event?eventId=153023863",gotickets:"https://pro.gotickets.com/tickets/541473/2026-fifa-world-cup-match-89-tickets/lincoln-financial-field-philadelphia-pa-7-4-2026"},
{id:90,name:"R16: W73 vs W75",group:"KO",venue:"NRG Stadium",capacity:71500,location:"Houston, TX",date:"7/4",day:"Sat",time:"",pMin:679.00,p25:1314.74,p50:2384.07,ticketQty:4025,listingQty:874,visits7d:71647,trans7d:16,pos:"https://reachpro.com/inventory/event?eventId=153021196",gotickets:"https://pro.gotickets.com/tickets/541536/2026-fifa-world-cup-match-90-tickets/nrg-stadium-houston-tx-7-4-2026"},
{id:91,name:"R16: W76 vs W78",group:"KO",venue:"MetLife Stadium",capacity:82500,location:"East Rutherford, NJ",date:"7/5",day:"Sun",time:"",pMin:881.05,p25:1530.00,p50:2326.70,ticketQty:3588,listingQty:789,visits7d:72026,trans7d:14,pos:"https://reachpro.com/inventory/event?eventId=153023886",gotickets:"https://pro.gotickets.com/tickets/541521/2026-fifa-world-cup-match-91-tickets/metlife-stadium-east-rutherford-nj-7-5-2026"},
{id:92,name:"R16: W79 vs W80",group:"KO",venue:"Estadio Azteca",capacity:98500,location:"Ciudad de Mexico",date:"7/5",day:"Sun",time:"",pMin:836.29,p25:1319.50,p50:2025.00,ticketQty:2168,listingQty:417,visits7d:67671,trans7d:19,pos:"https://reachpro.com/inventory/event?eventId=153033507",gotickets:"https://pro.gotickets.com/tickets/541375/w79-vs-w80-world-cup-match-92-tickets/estadio-azteca-ciudad-de-m-xico-cdmx-7-5-2026"},
{id:93,name:"R16: W83 vs W84",group:"KO",venue:"AT&T Stadium",capacity:80000,location:"Arlington, TX",date:"7/6",day:"Mon",time:"",pMin:783.05,p25:1412.77,p50:2134.08,ticketQty:3645,listingQty:801,visits7d:71029,trans7d:12,pos:"https://reachpro.com/inventory/event?eventId=153021528",gotickets:"https://pro.gotickets.com/tickets/541324/2026-fifa-world-cup-match-93-tickets/at-t-stadium-arlington-tx-7-6-2026"},
{id:94,name:"R16: W81 vs W82",group:"KO",venue:"Lumen Field",capacity:67000,location:"Seattle, WA",date:"7/6",day:"Mon",time:"",pMin:783.05,p25:1433.14,p50:2250.00,ticketQty:3507,listingQty:749,visits7d:67790,trans7d:14,pos:"https://reachpro.com/inventory/event?eventId=153020574",gotickets:"https://pro.gotickets.com/tickets/541491/2026-fifa-world-cup-match-94-tickets/lumen-field-seattle-wa-7-6-2026"},
{id:95,name:"R16: W86 vs W88",group:"KO",venue:"Mercedes-Benz Stadium",capacity:71000,location:"Atlanta, GA",date:"7/7",day:"Tue",time:"",pMin:753.20,p25:1318.42,p50:2500.00,ticketQty:3946,listingQty:855,visits7d:68186,trans7d:17,pos:"https://reachpro.com/inventory/event?eventId=155049347",gotickets:"https://pro.gotickets.com/tickets/541510/2026-fifa-world-cup-match-95-tickets/mercedes-benz-stadium-atlanta-ga-7-7-2026"},
{id:96,name:"R16: W85 vs W87",group:"KO",venue:"BC Place Stadium",capacity:54500,location:"Vancouver, Canada",date:"7/7",day:"Tue",time:"",pMin:865.80,p25:1635.00,p50:2526.59,ticketQty:3141,listingQty:677,visits7d:71313,trans7d:9,pos:"https://reachpro.com/inventory/event?eventId=153020500",gotickets:"https://pro.gotickets.com/tickets/541353/2026-fifa-world-cup-match-96-tickets/bc-place-stadium-vancouver-bc-7-7-2026"},
{id:97,name:"QF: W89 vs W90",group:"KO",venue:"Gillette Stadium",capacity:68756,location:"Foxborough, MA",date:"7/9",day:"Thu",time:"",pMin:1042.75,p25:1820.90,p50:2792.62,ticketQty:3290,listingQty:690,visits7d:26459,trans7d:12,pos:"https://reachpro.com/inventory/event?eventId=153023895",gotickets:"https://pro.gotickets.com/tickets/541424/2026-fifa-world-cup-match-97-quarter-final-tickets/gillette-stadium-foxborough-ma-7-9-2026"},
{id:98,name:"QF: W93 vs W94",group:"KO",venue:"SoFi Stadium",capacity:70240,location:"Inglewood, CA",date:"7/10",day:"Fri",time:"",pMin:1280.37,p25:2183.40,p50:3310.47,ticketQty:3710,listingQty:813,visits7d:117338,trans7d:17,pos:"https://reachpro.com/inventory/event?eventId=153020733",gotickets:"https://pro.gotickets.com/tickets/541546/2026-fifa-world-cup-match-98-quarter-final-tickets/sofi-stadium-inglewood-ca-7-10-2026"},
{id:99,name:"QF: W91 vs W92",group:"KO",venue:"Hard Rock Stadium",capacity:76100,location:"Miami Gardens, FL",date:"7/11",day:"Sat",time:"",pMin:1500.00,p25:2282.84,p50:3352.36,ticketQty:3419,listingQty:742,visits7d:116989,trans7d:13,pos:"https://reachpro.com/inventory/event?eventId=153023896",gotickets:"https://pro.gotickets.com/tickets/541438/2026-fifa-world-cup-match-99-quarter-final-tickets/hard-rock-stadium-miami-gardens-fl-7-11-2026"},
{id:100,name:"QF: W95 vs W96",group:"KO",venue:"GEHA Field at Arrowhead",capacity:76416,location:"Kansas City, MO",date:"7/11",day:"Sat",time:"",pMin:1273.02,p25:2360.60,p50:3288.75,ticketQty:3076,listingQty:659,visits7d:113909,trans7d:4,pos:"https://reachpro.com/inventory/event?eventId=153021616",gotickets:"https://pro.gotickets.com/tickets/541407/2026-fifa-world-cup-match-100-quarter-final-tickets/geha-field-at-arrowhead-stadium-kansas-city-mo-7-11-2026"},
{id:101,name:"SF: W97 vs W98",group:"KO",venue:"AT&T Stadium",capacity:80000,location:"Arlington, TX",date:"7/14",day:"Tue",time:"2:00PM",pMin:1840.50,p25:3153.35,p50:5251.42,ticketQty:3469,listingQty:723,visits7d:117236,trans7d:5,pos:"https://reachpro.com/inventory/event?eventId=153021542",gotickets:"https://pro.gotickets.com/tickets/554370/2026-fifa-world-cup-match-101-semi-final-tickets/at-t-stadium-arlington-tx-7-14-2026"},
{id:102,name:"SF: W99 vs W100",group:"KO",venue:"Mercedes-Benz Stadium",capacity:71000,location:"Atlanta, GA",date:"7/15",day:"Wed",time:"3:00PM",pMin:1743.32,p25:3173.00,p50:5060.00,ticketQty:3524,listingQty:759,visits7d:115013,trans7d:19,pos:"https://reachpro.com/inventory/event?eventId=153023901",gotickets:"https://pro.gotickets.com/tickets/555721/2026-fifa-world-cup-match-102-semi-final-tickets/mercedes-benz-stadium-atlanta-ga-7-15-2026"},
{id:103,name:"3rd Place",group:"KO",venue:"Hard Rock Stadium",capacity:76100,location:"Miami Gardens, FL",date:"7/18",day:"Sat",time:"5:00PM",pMin:899.10,p25:1347.39,p50:2271.43,ticketQty:3506,listingQty:786,visits7d:147204,trans7d:10,pos:"https://reachpro.com/inventory/event?eventId=153023903",gotickets:"https://pro.gotickets.com/tickets/556882/2026-fifa-world-cup-match-103-bronze-final-tickets/hard-rock-stadium-miami-gardens-fl-7-18-2026"},
{id:104,name:"Final",group:"KO",venue:"MetLife Stadium",capacity:82500,location:"East Rutherford, NJ",date:"7/19",day:"Sun",time:"3:00PM",pMin:6854.40,p25:11786.20,p50:15888.60,ticketQty:2423,listingQty:538,visits7d:124433,trans7d:11,pos:"https://reachpro.com/inventory/event?eventId=153020449",gotickets:"https://pro.gotickets.com/tickets/802218/2026-fifa-world-cup-match-104-final-tickets/metlife-stadium-east-rutherford-nj-7-19-2026"},
];

// ---------- INVENTORY DATA (sold + unsold as of 3/10) — 3,969 tix / 96 events / $561K P&L ----------
const INVENTORY = {
  2:{qty:38,sold:0,pnl:0},3:{qty:5,sold:0,pnl:0},4:{qty:20,sold:2,pnl:925},
  5:{qty:68,sold:60,pnl:30129},6:{qty:20,sold:0,pnl:0},7:{qty:8,sold:4,pnl:2477},
  8:{qty:59,sold:36,pnl:3555},9:{qty:68,sold:56,pnl:20463},10:{qty:89,sold:76,pnl:22658},
  11:{qty:45,sold:39,pnl:19223},12:{qty:28,sold:0,pnl:0},13:{qty:16,sold:12,pnl:667},
  14:{qty:36,sold:12,pnl:4922},15:{qty:20,sold:10,pnl:3247},16:{qty:22,sold:12,pnl:2529},
  17:{qty:16,sold:12,pnl:5420},18:{qty:38,sold:28,pnl:6460},19:{qty:68,sold:56,pnl:27334},
  20:{qty:24,sold:20,pnl:148},21:{qty:4,sold:0,pnl:0},22:{qty:60,sold:38,pnl:33183},
  23:{qty:60,sold:40,pnl:40732},25:{qty:99,sold:12,pnl:1685},26:{qty:84,sold:28,pnl:6009},
  29:{qty:71,sold:55,pnl:36999},30:{qty:44,sold:32,pnl:16460},31:{qty:112,sold:50,pnl:2061},
  32:{qty:8,sold:4,pnl:2794},34:{qty:156,sold:116,pnl:15716},35:{qty:104,sold:62,pnl:13579},
  36:{qty:6,sold:0,pnl:0},37:{qty:61,sold:46,pnl:-459},38:{qty:36,sold:20,pnl:6538},
  39:{qty:52,sold:44,pnl:11751},40:{qty:8,sold:4,pnl:213},41:{qty:22,sold:16,pnl:1392},
  42:{qty:44,sold:8,pnl:2339},43:{qty:40,sold:16,pnl:16617},44:{qty:56,sold:48,pnl:380},
  45:{qty:40,sold:28,pnl:20981},46:{qty:23,sold:2,pnl:416},47:{qty:44,sold:20,pnl:20814},
  49:{qty:20,sold:16,pnl:18023},50:{qty:54,sold:12,pnl:1589},51:{qty:4,sold:0,pnl:0},
  52:{qty:49,sold:10,pnl:148},54:{qty:10,sold:2,pnl:200},55:{qty:24,sold:12,pnl:63},
  56:{qty:12,sold:4,pnl:4883},57:{qty:37,sold:13,pnl:3577},58:{qty:103,sold:68,pnl:15834},
  59:{qty:8,sold:4,pnl:1589},60:{qty:72,sold:40,pnl:3185},61:{qty:56,sold:40,pnl:31295},
  62:{qty:13,sold:0,pnl:0},63:{qty:64,sold:44,pnl:7074},64:{qty:13,sold:2,pnl:71},
  65:{qty:74,sold:58,pnl:-2590},66:{qty:2,sold:2,pnl:1254},67:{qty:40,sold:32,pnl:13874},
  68:{qty:24,sold:8,pnl:2644},69:{qty:108,sold:70,pnl:5032},70:{qty:40,sold:24,pnl:15009},
  71:{qty:14,sold:6,pnl:9062},72:{qty:35,sold:20,pnl:825},73:{qty:48,sold:4,pnl:1106},
  74:{qty:8,sold:0,pnl:0},75:{qty:30,sold:0,pnl:0},76:{qty:44,sold:8,pnl:1422},
  77:{qty:48,sold:0,pnl:0},78:{qty:64,sold:16,pnl:1320},80:{qty:56,sold:0,pnl:0},
  81:{qty:19,sold:0,pnl:0},82:{qty:55,sold:8,pnl:1904},83:{qty:16,sold:0,pnl:0},
  84:{qty:80,sold:0,pnl:0},85:{qty:22,sold:0,pnl:0},86:{qty:14,sold:0,pnl:0},
  87:{qty:119,sold:0,pnl:0},88:{qty:49,sold:12,pnl:2782},89:{qty:44,sold:0,pnl:0},
  90:{qty:42,sold:0,pnl:0},91:{qty:40,sold:0,pnl:0},92:{qty:12,sold:0,pnl:0},
  93:{qty:32,sold:8,pnl:3705},94:{qty:52,sold:20,pnl:11910},95:{qty:58,sold:10,pnl:1612},
  96:{qty:17,sold:0,pnl:0},97:{qty:44,sold:0,pnl:0},98:{qty:40,sold:0,pnl:0},
  99:{qty:24,sold:0,pnl:0},100:{qty:56,sold:10,pnl:2483},101:{qty:13,sold:0,pnl:0},
  102:{qty:13,sold:0,pnl:0},103:{qty:4,sold:0,pnl:0},104:{qty:8,sold:0,pnl:0},
};

// ---------- SENTIMENT DATA ----------
const SENTIMENT = {
  "Canada":10,"Mexico":10,"USA":10,"Spain":10,"Argentina":10,"France":10,"England":10,"Brazil":10,"Portugal":10,
  "Germany":10,"Netherlands":7,"Belgium":7,"Croatia":8,"Morocco":6,"Colombia":8,"Uruguay":8,"Switzerland":7,
  "Japan":6,"Senegal":3,"Iran":3,"Korea Republic":6,"Ecuador":7,"Austria":7,"Australia":8,"Norway":9,
  "Panama":6,"Egypt":5,"Algeria":5,"Scotland":8,"Paraguay":5,"Tunisia":4,"Cote d'Ivoire":3,"Uzbekistan":3,
  "Qatar":4,"Saudi Arabia":5,"South Africa":5,"Jordan":3,"Cabo Verde":3,"Ghana":3,"Curacao":2,"Haiti":3,
  "New Zealand":6,
};

// ---------- GROUPS ----------
const GROUPS = {
  A:["Mexico","South Africa","Korea Republic","UEFA Playoff D"],
  B:["Canada","Switzerland","Qatar","UEFA Playoff A"],
  C:["Brazil","Morocco","Haiti","Scotland"],
  D:["USA","Paraguay","Australia","UEFA Playoff C"],
  E:["Germany","Curacao","Cote d'Ivoire","Ecuador"],
  F:["Netherlands","Japan","Tunisia","UEFA Playoff B"],
  G:["Belgium","Egypt","Iran","New Zealand"],
  H:["Spain","Cabo Verde","Saudi Arabia","Uruguay"],
  I:["France","Senegal","Norway","IC Winner 2"],
  J:["Argentina","Algeria","Austria","Jordan"],
  K:["Portugal","Uzbekistan","Colombia","IC Winner 1"],
  L:["England","Croatia","Ghana","Panama"],
};

// ---------- R32 SEEDS & BRACKET ----------
const R32_SEEDS = {
  A:{W:79,R:73},B:{W:85,R:73},C:{W:76,R:75},D:{W:81,R:88},
  E:{W:74,R:78},F:{W:75,R:76},G:{W:82,R:88},H:{W:84,R:86},
  I:{W:77,R:78},J:{W:86,R:84},K:{W:87,R:83},L:{W:80,R:83},
};
const NEXT_MATCH = {
  74:89,77:89,73:90,75:90,76:91,78:91,79:92,80:92,
  83:93,84:93,81:94,82:94,86:95,88:95,85:96,87:96,
  89:97,90:97,93:98,94:98,91:99,92:99,95:100,96:100,
  97:101,98:101,99:102,100:102,101:104,102:104,
};

// ---------- VENUE CITY MAP ----------
const VENUE_CITIES = {
  "Kansas City":[19,34,58,69,87,100],
  "Dallas / Arlington":[11,22,43,57,70,78,88,93,101],
  "Atlanta":[14,25,38,50,72,80,95,102],
  "Miami":[13,37,49,71,86,99,103],
  "Houston":[10,23,35,47,65,76,90],
  "Los Angeles":[4,15,26,39,59,73,84,98],
  "New York / NJ":[7,17,41,56,67,77,91,104],
  "Philadelphia":[9,29,42,55,68,89],
  "Boston / Foxborough":[5,18,30,45,61,74,97],
  "Seattle":[16,32,52,63,82,94],
  "San Francisco":[8,20,31,44,60,81],
  "Vancouver":[6,27,40,51,64,85,96],
  "Toronto":[3,21,33,46,62,83],
  "Mexico City":[1,24,53,79,92],
  "Monterrey":[12,36,54,75],
  "Guadalajara":[2,28,48,66],
};

// ---------- HELPERS ----------
function fmt(p){if(p==null||isNaN(p))return"N/A";return"$"+Number(p).toLocaleString("en-US",{minimumFractionDigits:0,maximumFractionDigits:0})}
function fmtK(n){if(n==null)return"--";if(n>=1000)return(n/1000).toFixed(1)+"k";return String(n)}
function getRound(mid){if(mid<=72)return"Group";if(mid<=88)return"R32";if(mid<=96)return"R16";if(mid<=100)return"QF";if(mid<=102)return"Semi";if(mid===103)return"3rd";if(mid===104)return"Final";return""}
function getPath(start){const p=[];let c=start;while(c){p.push(c);c=NEXT_MATCH[c]||null}return p}
function findGroupMatches(team,events){
  const lower=team.toLowerCase();
  const aliases={"korea republic":["korea"],"cote d'ivoire":["ivory coast"],"cabo verde":["cape verde"],"usa":["united states"]};
  const terms=[lower,...(aliases[lower]||[])];
  return events.filter(e=>e.id<=72&&terms.some(t=>e.name.toLowerCase().includes(t))).map(e=>e.id);
}
function sentimentColor(s){if(s>=9)return{bg:"#064e3b",text:"#6ee7b7"};if(s>=7)return{bg:"#1e3a5f",text:"#93c5fd"};if(s>=5)return{bg:"#78350f",text:"#fcd34d"};return{bg:"#7f1d1d",text:"#fca5a5"}}

// ---------- MAIN COMPONENT ----------
export default function FIFA2026SalesHub() {
  const [mode, setMode] = useState(null);
  const [events, setEvents] = useState(RAW_EVENTS);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [priceMax, setPriceMax] = useState(2000);
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [showInventoryOnly, setShowInventoryOnly] = useState(false);

  const eventMap = useMemo(() => { const m = {}; events.forEach(e => { m[e.id] = e }); return m }, [events]);

  // CSV upload
  const handleFileUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    Papa.parse(file, {
      header: true, skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data;
        const headers = Object.keys(rows[0] || {}).map(h => h.toUpperCase());
        let count = 0;
        const updated = [...events];
        rows.forEach(row => {
          const rawId = row["Match #"] || row["MATCH NUMBER"] || row["Match_ID"] || "";
          const numMatch = String(rawId).match(/\d+/);
          if (!numMatch) return;
          const mid = parseInt(numMatch[0]);
          const idx = updated.findIndex(e => e.id === mid);
          if (idx === -1) return;
          const rawPrice = row["Price Min"] || row["Get-In Price"] || "";
          const price = parseFloat(String(rawPrice).replace(/[$,\s]/g, ""));
          if (!isNaN(price) && price > 0) { updated[idx] = {...updated[idx], pMin: price}; count++; }
          const p25 = parseFloat(String(row["Price P25"] || "").replace(/[$,\s]/g, ""));
          if (!isNaN(p25)) updated[idx] = {...updated[idx], p25};
          const p50 = parseFloat(String(row["Price P50"] || "").replace(/[$,\s]/g, ""));
          if (!isNaN(p50)) updated[idx] = {...updated[idx], p50};
          const pos = row["POS LINK"] || row["POS Link"] || "";
          if (pos.includes("http")) updated[idx] = {...updated[idx], pos};
          const go = row["GOTICKETS LINK"] || row["GoTickets Link"] || "";
          if (go.includes("http")) updated[idx] = {...updated[idx], gotickets: go};
        });
        setEvents(updated);
        setUploadStatus(`${count} matches updated from ${file.name}`);
      }
    });
  }, [events]);

  // Sort handler
  const handleSort = (col) => {
    if (sortCol === col) { setSortDir(d => d === "asc" ? "desc" : "asc"); }
    else { setSortCol(col); setSortDir("asc"); }
  };
  const sortRows = (rows) => {
    if (!sortCol) return rows;
    return [...rows].sort((a, b) => {
      let va = a[sortCol], vb = b[sortCol];
      if (typeof va === "string") va = va.toLowerCase();
      if (typeof vb === "string") vb = vb.toLowerCase();
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  };

  // Team Path
  const teamResults = useMemo(() => {
    if (!selectedTeam) return null;
    let gl = null;
    for (const [g, teams] of Object.entries(GROUPS)) { if (teams.includes(selectedTeam)) { gl = g; break; } }
    if (!gl) return null;
    const gm = findGroupMatches(selectedTeam, events);
    return { gl, gm, wp: getPath(R32_SEEDS[gl].W), rp: getPath(R32_SEEDS[gl].R) };
  }, [selectedTeam, events]);

  // Venue Scout
  const venueResults = useMemo(() => {
    if (!selectedCity) return [];
    return (VENUE_CITIES[selectedCity] || []).map(id => eventMap[id]).filter(Boolean);
  }, [selectedCity, eventMap]);

  // Price Hunter
  const priceResults = useMemo(() => {
    let filtered = events.filter(e => e.pMin != null && e.pMin >= 100 && e.pMin <= priceMax);
    if (showInventoryOnly) filtered = filtered.filter(e => INVENTORY[e.id]);
    return filtered.sort((a, b) => a.pMin - b.pMin);
  }, [events, priceMax, showInventoryOnly]);

  // All teams sorted
  const allTeams = useMemo(() => {
    const t = [];
    Object.entries(GROUPS).forEach(([g, teams]) => { teams.forEach(name => t.push({ name, group: g })) });
    return t.sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  // Portfolio stats
  const portfolio = useMemo(() => {
    let totalQty = 0, totalSold = 0, totalPnl = 0, unrealizedValue = 0;
    Object.entries(INVENTORY).forEach(([mid, inv]) => {
      totalQty += inv.qty;
      totalSold += inv.sold;
      totalPnl += inv.pnl;
      const unsold = inv.qty - inv.sold;
      const ev = eventMap[parseInt(mid)];
      if (ev && unsold > 0) unrealizedValue += unsold * ev.pMin;
    });
    return { totalQty, totalSold, totalPnl, unrealizedValue, unsold: totalQty - totalSold };
  }, [eventMap]);

  // ---------- ROW COMPONENT ----------
  function MatchRow({ e, pathLabel }) {
    const inv = INVENTORY[e.id];
    const round = getRound(e.id);
    const roundColors = {
      Group:"#1e3a5f",R32:"#2d1b69",R16:"#4a1942",QF:"#6b2131",Semi:"#8b4513","3rd":"#555",Final:"#b8860b"
    };
    return (
      <tr className="border-b border-gray-700/50 hover:bg-gray-800/70 transition-colors">
        <td className="px-2 py-2 font-mono text-sm text-cyan-400 whitespace-nowrap">M{e.id}</td>
        <td className="px-2 py-2 text-sm">
          <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold mr-1.5 uppercase tracking-wider" style={{background:roundColors[round]||"#333",color:round==="Final"?"#000":"#fff"}}>{pathLabel||round}</span>
          <span className="text-gray-100">{e.name}</span>
          {e.group !== "KO" && <span className="ml-1.5 text-[10px] text-gray-500">Grp {e.group}</span>}
        </td>
        <td className="px-2 py-2 text-sm text-gray-300 max-w-[180px] truncate">{e.venue}</td>
        <td className="px-2 py-2 text-sm text-gray-400 whitespace-nowrap">{e.date}</td>
        <td className="px-2 py-2 text-sm font-semibold text-green-400 whitespace-nowrap">{fmt(e.pMin)}</td>
        <td className="px-2 py-2 text-sm text-gray-500 whitespace-nowrap">{fmt(e.p25)}</td>
        <td className="px-2 py-2 text-sm text-gray-500 whitespace-nowrap">{fmt(e.p50)}</td>
        <td className="px-2 py-2 text-sm text-gray-400 whitespace-nowrap text-right">{fmtK(e.visits7d)}</td>
        <td className="px-2 py-2 text-sm text-gray-400 whitespace-nowrap text-right">{e.trans7d||"--"}</td>
        <td className="px-2 py-2 text-sm whitespace-nowrap">
          {inv ? (
            <div className="flex items-center gap-1.5">
              <span className="text-yellow-400 font-semibold">{inv.qty - inv.sold}</span>
              <span className="text-gray-600">/</span>
              <span className="text-gray-500">{inv.qty}</span>
              {inv.pnl > 0 && <span className="text-green-500 text-[10px] ml-1">+{fmt(inv.pnl)}</span>}
            </div>
          ) : <span className="text-gray-700">--</span>}
        </td>
        <td className="px-2 py-2 text-sm">
          <div className="flex gap-1">
            {e.pos?.includes("http") && <a href={e.pos} target="_blank" rel="noopener noreferrer" className="px-1.5 py-0.5 bg-blue-600/80 hover:bg-blue-500 text-white rounded text-[10px] font-bold transition-colors">POS</a>}
            {e.gotickets?.includes("http") && <a href={e.gotickets} target="_blank" rel="noopener noreferrer" className="px-1.5 py-0.5 bg-purple-600/80 hover:bg-purple-500 text-white rounded text-[10px] font-bold transition-colors">GTX</a>}
          </div>
        </td>
      </tr>
    );
  }

  function SortHeader({ col, children, align }) {
    const active = sortCol === col;
    return (
      <th onClick={() => handleSort(col)} className={`px-2 py-2 cursor-pointer hover:text-cyan-300 transition-colors select-none ${align === "right" ? "text-right" : ""} ${active ? "text-cyan-400" : ""}`}>
        {children} {active ? (sortDir === "asc" ? "\u25B2" : "\u25BC") : ""}
      </th>
    );
  }

  function DataTable({ rows, count }) {
    const sorted = sortRows(rows);
    return (
      <div className="mt-3 overflow-x-auto rounded-lg border border-gray-700/70">
        <div className="px-3 py-1.5 bg-gray-800/80 text-[11px] text-gray-400 border-b border-gray-700/50 flex justify-between items-center">
          <span>{count} match{count !== 1 ? "es" : ""}</span>
          <span className="text-gray-600">Click headers to sort</span>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-800/60 text-gray-400 text-[10px] uppercase tracking-wider">
              <SortHeader col="id">ID</SortHeader>
              <th className="px-2 py-2">Event</th>
              <th className="px-2 py-2">Venue</th>
              <SortHeader col="date">Date</SortHeader>
              <SortHeader col="pMin">pMin</SortHeader>
              <SortHeader col="p25">P25</SortHeader>
              <SortHeader col="p50">P50</SortHeader>
              <SortHeader col="visits7d" align="right">Views 7d</SortHeader>
              <SortHeader col="trans7d" align="right">Sales 7d</SortHeader>
              <th className="px-2 py-2">Inv</th>
              <th className="px-2 py-2">Links</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(e => <MatchRow key={e.id} e={typeof e.id !== "undefined" ? e : eventMap[e]} />)}
          </tbody>
        </table>
      </div>
    );
  }

  // ---------- RENDER ----------
  return (
    <div className="min-h-screen bg-gray-950 text-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* HEADER */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700/50">
        <div className="max-w-[1400px] mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-xl font-bold tracking-tight"><span className="text-cyan-400">FIFA 2026</span> Sales Hub</h1>
              <p className="text-gray-500 text-xs mt-0.5">104 Matches &middot; 3/10 Pricing &middot; Live Inventory</p>
            </div>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-xs transition-colors">
                Upload CSV <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
              </label>
              {uploadStatus && <span className="text-[10px] text-green-400 max-w-xs truncate">{uploadStatus}</span>}
            </div>
          </div>

          {/* PORTFOLIO SUMMARY */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
            {[
              { label: "Total Tickets", value: portfolio.totalQty.toLocaleString(), color: "text-white" },
              { label: "Sold", value: portfolio.totalSold.toLocaleString(), color: "text-blue-400" },
              { label: "Unsold", value: portfolio.unsold.toLocaleString(), color: "text-yellow-400" },
              { label: "Realized P&L", value: fmt(portfolio.totalPnl), color: "text-green-400" },
              { label: "Unsold Floor Value", value: fmt(portfolio.unrealizedValue), color: "text-cyan-400" },
            ].map(s => (
              <div key={s.label} className="bg-gray-800/50 rounded-lg px-3 py-2 border border-gray-700/30">
                <div className="text-[10px] text-gray-500 uppercase tracking-wider">{s.label}</div>
                <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODE SELECTOR */}
      <div className="max-w-[1400px] mx-auto px-4 py-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
          {[
            { key: "team", icon: "\u26BD", title: "Team Path", desc: "Track knockout routes by team" },
            { key: "venue", icon: "\uD83C\uDFDF\uFE0F", title: "Venue Scout", desc: "Browse by host city" },
            { key: "price", icon: "\uD83D\uDCB0", title: "Price Hunter", desc: "Filter by budget range" },
            { key: "inventory", icon: "\uD83D\uDCCA", title: "Inventory", desc: "Your held positions & P&L" },
          ].map(m => (
            <button key={m.key} onClick={() => setMode(m.key)} className={`text-left p-4 rounded-lg border transition-all ${mode === m.key ? "border-cyan-500 bg-cyan-950/50 shadow-lg shadow-cyan-900/10" : "border-gray-700/50 bg-gray-900/50 hover:border-gray-500"}`}>
              <div className="text-xl mb-1">{m.icon}</div>
              <div className="font-semibold">{m.title}</div>
              <div className="text-gray-500 text-xs mt-0.5">{m.desc}</div>
            </button>
          ))}
        </div>

        {/* MODE: TEAM PATH */}
        {mode === "team" && (
          <div>
            <div className="flex items-center gap-3 flex-wrap mb-4">
              <select value={selectedTeam} onChange={e => setSelectedTeam(e.target.value)}
                className="bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 min-w-[240px]">
                <option value="">-- Choose a team --</option>
                {allTeams.map(t => {
                  const s = SENTIMENT[t.name];
                  return <option key={t.name} value={t.name}>Grp {t.group}: {t.name}{s ? ` (Sent: ${s})` : ""}</option>;
                })}
              </select>
              {selectedTeam && SENTIMENT[selectedTeam] && (() => {
                const s = SENTIMENT[selectedTeam];
                const sc = sentimentColor(s);
                return <span className="px-2 py-1 rounded text-xs font-bold" style={{background:sc.bg,color:sc.text}}>Sentiment: {s}/10</span>;
              })()}
            </div>
            {teamResults && (
              <div>
                <h3 className="text-base font-semibold mb-2"><span className="text-cyan-400">{selectedTeam}</span> — Group {teamResults.gl} Matches</h3>
                <DataTable rows={teamResults.gm.map(id => eventMap[id]).filter(Boolean)} count={teamResults.gm.length} />

                <h3 className="text-base font-semibold mt-6 mb-2">
                  <span className="px-2 py-0.5 rounded bg-green-900/60 text-green-300 text-xs mr-2">1st Place</span>Winner Path
                </h3>
                <DataTable rows={teamResults.wp.map(id => eventMap[id]).filter(Boolean)} count={teamResults.wp.length} />

                <h3 className="text-base font-semibold mt-6 mb-2">
                  <span className="px-2 py-0.5 rounded bg-yellow-900/60 text-yellow-300 text-xs mr-2">2nd Place</span>Runner-Up Path
                </h3>
                <DataTable rows={teamResults.rp.map(id => eventMap[id]).filter(Boolean)} count={teamResults.rp.length} />
              </div>
            )}
          </div>
        )}

        {/* MODE: VENUE SCOUT */}
        {mode === "venue" && (
          <div>
            <div className="flex flex-wrap gap-1.5 mb-5">
              {Object.keys(VENUE_CITIES).map(city => (
                <button key={city} onClick={() => setSelectedCity(city)} className={`px-2.5 py-1.5 rounded text-xs font-medium transition-all ${selectedCity === city ? "bg-cyan-600 text-white shadow" : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700/50"}`}>
                  {city} <span className="opacity-50 ml-0.5">({VENUE_CITIES[city].length})</span>
                </button>
              ))}
            </div>
            {selectedCity && venueResults.length > 0 && (
              <div>
                <h3 className="text-base font-semibold mb-2"><span className="text-cyan-400">{selectedCity}</span> — {venueResults.length} Matches</h3>
                <DataTable rows={venueResults} count={venueResults.length} />
              </div>
            )}
          </div>
        )}

        {/* MODE: PRICE HUNTER */}
        {mode === "price" && (
          <div>
            <div className="bg-gray-900/70 border border-gray-700/50 rounded-lg p-4 mb-5">
              <div className="flex items-center gap-6 flex-wrap">
                <div className="flex-1 min-w-[280px]">
                  <label className="text-xs text-gray-400 block mb-1.5">
                    Max Budget: <span className="text-green-400 font-bold text-sm">{fmt(priceMax)}</span>
                  </label>
                  <input type="range" min={100} max={8000} step={50} value={priceMax} onChange={e => setPriceMax(Number(e.target.value))}
                    className="w-full h-1.5 bg-gray-700 rounded appearance-none cursor-pointer accent-cyan-500" />
                  <div className="flex justify-between text-[10px] text-gray-600 mt-1">
                    <span>$100</span><span>$2k</span><span>$4k</span><span>$6k</span><span>$8k</span>
                  </div>
                </div>
                <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
                  <input type="checkbox" checked={showInventoryOnly} onChange={e => setShowInventoryOnly(e.target.checked)} className="accent-cyan-500" />
                  Our inventory only
                </label>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-400">{priceResults.length}</div>
                  <div className="text-[10px] text-gray-500">in budget</div>
                </div>
              </div>
            </div>
            {priceResults.length > 0 && <DataTable rows={priceResults} count={priceResults.length} />}
          </div>
        )}

        {/* MODE: INVENTORY */}
        {mode === "inventory" && (
          <div>
            <h3 className="text-base font-semibold mb-3">Active Inventory Positions <span className="text-gray-500 text-xs ml-2">{Object.keys(INVENTORY).length} events</span></h3>
            <DataTable
              rows={Object.keys(INVENTORY).map(id => eventMap[parseInt(id)]).filter(Boolean).sort((a, b) => {
                const ia = INVENTORY[a.id], ib = INVENTORY[b.id];
                return (ib.qty - ib.sold) - (ia.qty - ia.sold);
              })}
              count={Object.keys(INVENTORY).length}
            />
          </div>
        )}

        {/* LANDING */}
        {!mode && (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">{"\u26BD"}</div>
            <h2 className="text-lg font-semibold text-gray-300 mb-1">Select a Mode</h2>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Track team paths, scout venues, hunt prices, or review your inventory. Upload a CSV to refresh market data.
            </p>
          </div>
        )}
      </div>

      <div className="border-t border-gray-800/50 mt-8">
        <div className="max-w-[1400px] mx-auto px-4 py-3 text-[10px] text-gray-600 flex justify-between">
          <span>FIFA 2026 Sales Hub v2 &middot; Data: 3/10/2026</span>
          <span>{portfolio.totalQty.toLocaleString()} tickets across {Object.keys(INVENTORY).length} events</span>
        </div>
      </div>
      <SpeedInsights />
    </div>
  );
}
