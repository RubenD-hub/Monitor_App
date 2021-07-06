const express = require('express');
const router = express.Router();
const axios = require('axios');
const { checkAuth } = require('../middlewares/authentication.js');
const colors = require('colors');

import AlarmRule from '../models/emqx_alarm_rule.js';

const auth = {
    auth: {
        username: 'admin',
        password: 'emqxsecret'
    }
};

/*
============================================
                    API                                    
============================================
*/

//CREATE ALARM-RULE
router.post('/alarm-rule', checkAuth, async (req, res) => {

    var newRule = req.body.newRule;
    newRule.userId = req.userData._id;

    var r = await createAlarmRule(newRule);

    if (r) {

        const response = {
            status: "success",
        }

        return res.json(response);

    } else {
        const response = {
            status: "error",
        }

        return res.status(500).json(response);
    }

});


/*
============================================
                Functions                                    
============================================
*/

//CREATE ALARM
async function createAlarmRule(newAlarm) {

    const url = "http://localhost:8085/api/v4/rules";

    // topicExample = userid/did/temp  //msgExample = {value: 20}
    const topic = newAlarm.userId + "/" + newAlarm.dId + "/" + newAlarm.variable + "/sdata";

    const rawsql = "SELECT username, topic, payload FROM \"" + topic + "\" WHERE payload.value "  + newAlarm.condition + " " + newAlarm.value + " AND is_not_null(payload.value)";

    var newRule = {
        rawsql: rawsql,
        actions: [{
            name: "data_to_webserver",
            params: {
                $resource: global.alarmResource.id,
                payload_tmpl: '{"userId":"' + newAlarm.userId + '","payload":${payload},"topic":"${topic}"}'
            }
        }],
        description: "ALARM-RULE",
        enabled: newAlarm.status
    }

    //save rule in emqx - grabamos la regla en emqx
    const res = await axios.post(url, newRule, auth);
    var emqxRuleId = res.data.data.id;
    console.log(res.data.data);

    if (res.data.data && res.status === 200) {

        //save rule in mongo -- grabamos regla en mongo
        const mongoRule = await AlarmRule.create({
            userId: newAlarm.userId,
            dId: newAlarm.dId,
            emqxRuleId: emqxRuleId,
            status: newAlarm.status,
            variable: newAlarm.variable,
            varFullName: newAlarm.varFullName,
            value: newAlarm.value,
            condition: newAlarm.condition,
            triggerTime: newAlarm.triggerTime,
            createTime: Date.now()
        });

        const url = "http://localhost:8085/api/v4/rules/" + mongoRule.emqxRuleId;

        const payload_templ = '{"userId":"' + newAlarm.userId + '","dId":"' + newAlarm.dId + '","payload":${payload},"topic":"${topic}","emqxRuleId":"' + mongoRule.emqxRuleId + '","value":' + newAlarm.value + ',"condition":"' + newAlarm.condition + '","variable":"' + newAlarm.variable + '","variableFullName":"' + newAlarm.variableFullName + '","triggerTime":' + newAlarm.triggerTime + '}';

        newRule.actions[0].params.payload_tmpl = payload_templ;

        const res = await axios.put(url, newRule, auth);

        console.log("New Alarm Rule Created...".green);

        return true;

    }

}

module.exports = router; 